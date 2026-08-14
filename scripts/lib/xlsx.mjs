/**
 * Lector mínimo de archivos `.xlsx` sin dependencias externas.
 *
 * Un `.xlsx` es un ZIP con XML dentro. Este módulo implementa lo justo para el
 * ETL de `scripts/importar-om-rxd.mjs`: descompresión (store/deflate mediante
 * `zlib`) y una lectura de XML por expresiones regulares suficiente para las
 * hojas planas de los libros de seguimiento.
 *
 * Se mantiene sin dependencias a propósito: el proyecto exige `pnpm audit` en
 * verde y añadir un parser de Excel al árbol de producción no aporta valor,
 * porque el ETL se ejecuta fuera del build (ver README §Datos).
 */
import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

/** Descomprime un ZIP en memoria y devuelve `nombre -> contenido`. */
export function descomprimir(buffer) {
  const archivos = new Map();

  // El directorio central se localiza desde el final (registro EOCD).
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("ZIP inválido: no se encontró el registro EOCD");

  const total = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);

  for (let i = 0; i < total; i++) {
    const largoNombre = buffer.readUInt16LE(offset + 28);
    const largoExtra = buffer.readUInt16LE(offset + 30);
    const largoComentario = buffer.readUInt16LE(offset + 32);
    const metodo = buffer.readUInt16LE(offset + 10);
    const tamComprimido = buffer.readUInt32LE(offset + 20);
    const offsetLocal = buffer.readUInt32LE(offset + 42);
    const nombre = buffer.toString("utf8", offset + 46, offset + 46 + largoNombre);

    // La cabecera local repite nombre/extra con longitudes propias.
    const largoNombreLocal = buffer.readUInt16LE(offsetLocal + 26);
    const largoExtraLocal = buffer.readUInt16LE(offsetLocal + 28);
    const inicio = offsetLocal + 30 + largoNombreLocal + largoExtraLocal;
    const crudo = buffer.subarray(inicio, inicio + tamComprimido);

    archivos.set(nombre, metodo === 0 ? crudo : inflateRawSync(crudo));
    offset += 46 + largoNombre + largoExtra + largoComentario;
  }

  return archivos;
}

const ENTIDADES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'" };

/** Decodifica entidades XML (nombradas y numéricas). */
function decodificar(texto) {
  return texto
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (m) => ENTIDADES[m]);
}

/**
 * Elementos `<etiqueta>` completos, tanto autocerrados como con cierre propio.
 *
 * El orden de las alternativas importa: la forma autocerrada se prueba primero,
 * y `[^>]*` impide que los atributos crucen el `>` de apertura. Un patrón
 * ingenuo como `<row[\s\S]*?(?:<\/row>|\/>)` se corta en el primer `/>` que
 * encuentre —que suele ser una celda vacía, `<c r="A5"/>`— y descarta en
 * silencio todo lo que venga después en esa fila.
 */
const elementos = (xml, etiqueta) =>
  xml.match(
    new RegExp(`<${etiqueta}\\b[^>]*\\/>|<${etiqueta}\\b[^>]*>[\\s\\S]*?<\\/${etiqueta}>`, "g"),
  ) ?? [];

/**
 * Tabla de cadenas compartidas (`sharedStrings.xml`).
 *
 * El orden posicional importa: cada `<si>` es una entrada del índice al que
 * apuntan las celdas con `t="s"`, así que una entrada vacía también cuenta.
 */
function leerCadenas(xml) {
  if (!xml) return [];
  return elementos(xml, "si").map((si) => {
    let texto = "";
    for (const t of si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) texto += t[1];
    return decodificar(texto);
  });
}

/** Convierte la parte alfabética de una referencia (`BC12`) en índice 0-based. */
function indiceColumna(referencia) {
  const letras = referencia.match(/^([A-Z]+)/)?.[1] ?? "A";
  let indice = 0;
  for (const letra of letras) indice = indice * 26 + (letra.charCodeAt(0) - 64);
  return indice - 1;
}

/**
 * Rangos de celdas combinadas de una hoja.
 * Filas en base 1 (como Excel); columnas en base 0 (como la matriz).
 */
function leerCombinaciones(xml) {
  const bloque = xml.match(/<mergeCells[\s\S]*?<\/mergeCells>/)?.[0];
  if (!bloque) return [];
  return [...bloque.matchAll(/ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"/g)].map((m) => ({
    c1: indiceColumna(m[1]),
    f1: Number(m[2]),
    c2: indiceColumna(m[3]),
    f2: Number(m[4]),
  }));
}

/**
 * «Descombina»: replica el valor de la celda superior-izquierda en todas las
 * celdas de su rango combinado.
 *
 * En un `.xlsx` una celda combinada guarda el valor **solo** en su esquina
 * superior-izquierda; el resto del rango queda vacío. Al replicarlo, cada fila
 * queda completa por sí misma y deja de depender del formato visual: si una OM
 * ocupa cuatro filas, las cuatro conocen su PM N° y su oportunidad.
 *
 * Nunca sobrescribe un valor existente.
 */
function descombinar(filas, combinaciones) {
  for (const { c1, f1, c2, f2 } of combinaciones) {
    const valor = filas[f1 - 1]?.[c1];
    if (valor == null || valor === "") continue;

    for (let f = f1; f <= f2; f++) {
      if (!filas[f - 1]) filas[f - 1] = [];
      for (let c = c1; c <= c2; c++) {
        const actual = filas[f - 1][c];
        if (actual == null || actual === "") filas[f - 1][c] = valor;
      }
    }
  }
  return filas;
}

/** Convierte una hoja XML en una matriz `filas[fila][columna]`. */
function leerFilas(xml, cadenas) {
  const filas = [];
  for (const filaXml of elementos(xml, "row")) {
    const numeroFila = Number(filaXml.match(/\sr="(\d+)"/)?.[1] ?? filas.length + 1);
    const celdas = [];

    for (const celdaXml of elementos(filaXml, "c")) {
      const referencia = celdaXml.match(/\sr="([A-Z]+\d+)"/)?.[1];
      if (!referencia) continue;

      const tipo = celdaXml.match(/\st="([^"]+)"/)?.[1];
      let valor = null;

      if (tipo === "inlineStr") {
        let texto = "";
        for (const t of celdaXml.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) texto += t[1];
        valor = decodificar(texto);
      } else {
        const crudo = celdaXml.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1];
        if (crudo != null) {
          if (tipo === "s") valor = cadenas[Number(crudo)] ?? null;
          else if (tipo === "str") valor = decodificar(crudo);
          else valor = Number(crudo);
        }
      }

      if (valor !== null && valor !== "") celdas[indiceColumna(referencia)] = valor;
    }

    filas[numeroFila - 1] = celdas;
  }
  return descombinar(filas, leerCombinaciones(xml));
}

/**
 * Lee un libro completo y devuelve sus hojas con nombre y filas.
 *
 * @param {string} ruta Ruta absoluta del `.xlsx`.
 * @returns {{ nombre: string, filas: (string|number)[][] }[]}
 */
export function leerLibro(ruta) {
  const zip = descomprimir(readFileSync(ruta));
  const texto = (nombre) => (zip.has(nombre) ? zip.get(nombre).toString("utf8") : null);

  const cadenas = leerCadenas(texto("xl/sharedStrings.xml"));
  const libro = texto("xl/workbook.xml") ?? "";
  const relaciones = texto("xl/_rels/workbook.xml.rels") ?? "";

  const destinoPorId = new Map();
  for (const rel of relaciones.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
    destinoPorId.set(rel[1], rel[2].replace(/^\/?xl\//, "").replace(/^\//, ""));
  }

  const hojas = [];
  for (const etiqueta of libro.matchAll(/<sheet[^>]*\/?>/g)) {
    const nombre = decodificar(etiqueta[0].match(/name="([^"]*)"/)?.[1] ?? "");
    const destino = destinoPorId.get(etiqueta[0].match(/r:id="([^"]+)"/)?.[1] ?? "");
    const xml = destino ? texto(`xl/${destino}`) : null;
    if (xml) hojas.push({ nombre, filas: leerFilas(xml, cadenas) });
  }
  return hojas;
}

/** Convierte un número de serie de Excel a fecha ISO (`YYYY-MM-DD`). */
export function fechaDesdeSerial(serial) {
  // 25569 = días entre la época de Excel (1899-12-30) y la de Unix.
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const fecha = new Date(ms);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString().slice(0, 10);
}
