/**
 * Paso 1 del pipeline: `data/*.xlsx` → `data-limpio/*.xlsx`.
 *
 * Ejecutar con:  pnpm datos:limpiar
 *
 * Toma los libros de seguimiento tal como los mantiene la institución y produce
 * una versión **plana y sin ambigüedades** de los mismos datos:
 *
 * - Sin celdas combinadas: cada fila es una OM completa.
 * - Sin filas vacías intercaladas ni filas de totales.
 * - Sin hojas duplicadas de una misma vigencia.
 * - Encabezados de corte normalizados a `Observación AAAA-MM-DD · <funcionario>`.
 * - Fechas de entrega interpretadas a ISO en una columna aparte, conservando
 *   siempre el texto original tal como se redactó.
 *
 * No inventa, no corrige y no descarta contenido: solo reordena lo que ya está,
 * de modo que el paso de importación no tenga que interpretar formato.
 */
import { readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { leerLibro } from "./lib/xlsx.mjs";
import { escribirLibro } from "./lib/xlsx-escribir.mjs";
import { SISTEMAS, limpiar, normalizarFecha, vigenciaDeHoja } from "./lib/dominio.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = join(RAIZ, "data");
const DESTINO = join(RAIZ, "data-limpio");

/** Columnas fijas que abren toda hoja limpia. */
const COLUMNAS_BASE = [
  "PM N°",
  "Vigencia",
  "Fecha de entrega",
  "Fecha de entrega (ISO)",
  "Responsable",
  "Oportunidad de Mejora",
  "Entregable",
];

/**
 * Empareja cada columna de observación con su columna de clasificación y lee la
 * fecha del corte de su encabezado.
 *
 * No se puede asumir que sean adyacentes: alguna hoja intercala una columna
 * «EVIDENCIA» entre ambas. Los cortes cuya fecha no se puede interpretar se
 * descartan con aviso, para que todo seguimiento tenga fecha.
 */
function mapearCortes(encabezados, avisos, contexto) {
  const cortes = [];

  for (let col = 0; col < encabezados.length; col++) {
    if (!/OBSERVACI[OÓ]N/i.test(String(encabezados[col] ?? ""))) continue;

    let colClasificacion = -1;
    for (let siguiente = col + 1; siguiente < encabezados.length; siguiente++) {
      const cabecera = String(encabezados[siguiente] ?? "");
      if (/OBSERVACI[OÓ]N/i.test(cabecera)) break;
      if (/CLASIFICACI[OÓ]N/i.test(cabecera)) {
        colClasificacion = siguiente;
        break;
      }
    }
    if (colClasificacion < 0) {
      avisos.push(`${contexto}: columna ${col} sin CLASIFICACION asociada, omitida`);
      continue;
    }

    const texto = limpiar(encabezados[col]);
    const funcionario = limpiar(texto.match(/FUNCIONARIO\s*:?\s*(.*?)\s*FECHA\s*:/i)?.[1] ?? "");
    const fechaTexto = limpiar(texto.match(/FECHA\s*:?\s*(.*)$/i)?.[1] ?? "");
    // «23 - 04 - 2024» y «26-07-2023» llegan con espacios intercalados.
    const compacta = fechaTexto.replace(/\s*-\s*/g, "-").replace(/\s*\/\s*/g, "/");
    const fecha = normalizarFecha(compacta) ?? normalizarFecha(fechaTexto);

    if (!fecha) {
      avisos.push(`${contexto}: corte sin fecha interpretable («${fechaTexto}»), omitido`);
      continue;
    }

    cortes.push({
      fecha,
      funcionario: funcionario || "Sin registrar",
      colObservacion: col,
      colClasificacion,
    });
  }

  return cortes;
}

/**
 * Agrupa filas físicas en registros lógicos de OM.
 *
 * El lector ya replicó los valores de las celdas combinadas, así que una OM que
 * ocupaba varias filas aparece repetida en todas ellas. Se consideran la misma
 * OM las filas consecutivas que comparten `PM N°` y no se contradicen en la
 * oportunidad: los libros combinan unas columnas y otras no, de modo que una
 * fila de continuación puede traer número y responsable con la oportunidad
 * vacía. Solo se separan cuando ambas declaran una oportunidad distinta.
 */
function agruparEnOM(filas) {
  const grupos = [];

  for (let i = 1; i < filas.length; i++) {
    const fila = filas[i] ?? [];
    const numero = limpiar(fila[0]);

    if (/^total/i.test(numero)) continue; // fila de cierre del libro

    const oportunidad = limpiar(fila[3]);
    const responsable = limpiar(fila[2]);
    if (!oportunidad && !responsable) continue;

    const previo = grupos[grupos.length - 1];
    const oportunidadPrevia = previo ? limpiar(previo[0][3]) : "";
    const continua =
      previo &&
      numero !== "" &&
      limpiar(previo[0][0]) === numero &&
      (oportunidad === "" || oportunidadPrevia === "" || oportunidadPrevia === oportunidad);

    if (continua) previo.push(fila);
    else grupos.push([fila]);
  }

  return grupos;
}

/** Texto de una columna dentro del grupo, sin repetir valores. */
function valorUnico(grupo, columna) {
  const vistos = [];
  for (const fila of grupo) {
    const valor = limpiar(fila[columna]);
    if (valor && !vistos.includes(valor)) vistos.push(valor);
  }
  return vistos.join(" ");
}

/** Primera calificación numérica de una columna dentro del grupo. */
function primerNumero(grupo, columna) {
  for (const fila of grupo) {
    const bruto = fila[columna];
    if (bruto === "" || bruto == null) continue;
    const valor = Number(bruto);
    if (Number.isFinite(valor)) return valor;
  }
  return null;
}

/** Convierte una hoja del libro original en una hoja limpia. */
function limpiarHoja(hoja, avisos, contexto) {
  const filas = hoja.filas.filter((f) => f && f.some((c) => c != null && c !== ""));
  if (filas.length < 2) return null;

  const encabezados = filas[0];
  if (!/PM\s*N/i.test(String(encabezados[0] ?? ""))) return null;

  const vigencia = vigenciaDeHoja(hoja.nombre);
  const cortes = mapearCortes(encabezados, avisos, contexto);

  const cabecera = [
    ...COLUMNAS_BASE,
    ...cortes.flatMap((c) => [
      `Observación ${c.fecha} · ${c.funcionario}`,
      `Clasificación ${c.fecha}`,
    ]),
  ];

  const cuerpo = agruparEnOM(filas).map((grupo) => {
    const fechaTexto = valorUnico(grupo, 1);
    const serie = grupo.map((f) => f[1]).find((v) => typeof v === "number");
    const numeroTexto = valorUnico(grupo, 0);

    return [
      /^\d+$/.test(numeroTexto) ? Number(numeroTexto) : numeroTexto,
      vigencia,
      fechaTexto,
      normalizarFecha(serie ?? fechaTexto) ?? "",
      valorUnico(grupo, 2),
      valorUnico(grupo, 3),
      valorUnico(grupo, 4),
      ...cortes.flatMap((c) => [
        valorUnico(grupo, c.colObservacion),
        primerNumero(grupo, c.colClasificacion),
      ]),
    ];
  });

  return { nombre: hoja.nombre, filas: [cabecera, ...cuerpo], registros: cuerpo.length };
}

function main() {
  const archivos = readdirSync(ORIGEN).filter(
    (f) => f.toLowerCase().endsWith(".xlsx") && !f.startsWith("~$"),
  );
  const avisos = [];
  const bloqueados = [];

  mkdirSync(DESTINO, { recursive: true });

  // Se limpian los libros obsoletos uno a uno, no la carpeta entera: si el
  // usuario tiene uno abierto en Excel, borrar el directorio falla con EPERM y
  // dejaría el paso a medias. Aquí solo se pierde el archivo bloqueado, que de
  // todas formas se reescribe a continuación.
  const esperados = new Set(SISTEMAS.map((s) => `${s.id}.xlsx`));
  for (const previo of readdirSync(DESTINO)) {
    if (!previo.endsWith(".xlsx") || esperados.has(previo)) continue;
    try {
      rmSync(join(DESTINO, previo));
    } catch {
      avisos.push(`No se pudo eliminar el libro obsoleto data-limpio/${previo} (¿abierto?)`);
    }
  }

  let totalHojas = 0;
  let totalRegistros = 0;

  for (const definicion of SISTEMAS) {
    const archivo = archivos.find((f) => definicion.patron.test(f));
    if (!archivo) {
      avisos.push(`Sin archivo para ${definicion.sigla} (patrón ${definicion.patron})`);
      continue;
    }

    const hojasLimpias = [];
    const vigenciasVistas = new Set();

    for (const hoja of leerLibro(join(ORIGEN, archivo))) {
      const vigencia = vigenciaDeHoja(hoja.nombre);
      if (vigencia && vigenciasVistas.has(vigencia)) {
        avisos.push(
          `${definicion.sigla}: hoja duplicada «${hoja.nombre}» (vigencia ${vigencia}) omitida`,
        );
        continue;
      }

      const limpia = limpiarHoja(hoja, avisos, `${definicion.sigla} «${hoja.nombre}»`);
      if (!limpia || limpia.registros === 0) continue;

      if (vigencia) vigenciasVistas.add(vigencia);
      hojasLimpias.push(limpia);
    }

    if (hojasLimpias.length === 0) {
      avisos.push(`${definicion.sigla}: ninguna hoja con datos`);
      continue;
    }

    const destino = join(DESTINO, `${definicion.id}.xlsx`);
    try {
      escribirLibro(destino, hojasLimpias);
    } catch (error) {
      // Excel bloquea el archivo mientras lo tiene abierto: se avisa con la
      // causa concreta y se sigue con los demás sistemas, en vez de abortar.
      if (error.code === "EBUSY" || error.code === "EPERM") {
        bloqueados.push(`data-limpio/${definicion.id}.xlsx`);
        continue;
      }
      throw error;
    }

    totalHojas += hojasLimpias.length;
    totalRegistros += hojasLimpias.reduce((n, h) => n + h.registros, 0);
    console.log(
      `✓ data-limpio/${definicion.id}.xlsx — ${hojasLimpias.length} hojas · ` +
        `${hojasLimpias.reduce((n, h) => n + h.registros, 0)} OM ` +
        `[${hojasLimpias.map((h) => h.nombre).join(", ")}]`,
    );
  }

  // Procedencia junto a los archivos generados: quién los produjo y desde qué.
  writeFileSync(
    join(DESTINO, "LEEME.md"),
    [
      "# Libros limpios (generados)",
      "",
      "**No editar a mano.** Esta carpeta se regenera por completo con:",
      "",
      "```bash",
      "pnpm datos:limpiar",
      "```",
      "",
      "Origen: los libros de [`../data/`](../data/), que son la fuente de verdad.",
      "",
      "Cada archivo es un sistema de gestión, con una hoja por vigencia. Frente a",
      "los originales, aquí no hay celdas combinadas, filas vacías intercaladas,",
      "hojas duplicadas ni filas de totales: **una fila es una oportunidad de**",
      "**mejora completa**.",
      "",
      "Los encabezados de seguimiento se normalizaron a",
      "`Observación AAAA-MM-DD · <funcionario>` y `Clasificación AAAA-MM-DD`, y se",
      "añadió `Fecha de entrega (ISO)` junto al texto original, que se conserva",
      "siempre tal como se redactó.",
      "",
      `Generado el ${new Date().toISOString().slice(0, 10)}.`,
      "",
    ].join("\n"),
    "utf8",
  );

  console.log(`\n${totalHojas} hojas · ${totalRegistros} OM en total`);
  for (const aviso of avisos) console.log(`  ! ${aviso}`);

  if (bloqueados.length > 0) {
    console.error(
      `\n✖ No se pudo escribir ${bloqueados.join(", ")}: el archivo está abierto en Excel.\n` +
        `  Ciérralo y vuelve a ejecutar «pnpm datos:importar».`,
    );
    process.exitCode = 1;
  }
}

main();
