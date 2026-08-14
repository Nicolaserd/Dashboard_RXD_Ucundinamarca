/**
 * Paso 2 del pipeline: `data-limpio/*.xlsx` → `src/data/om-rxd.json`.
 *
 * Ejecutar con:  pnpm datos:importar   (ejecuta antes la limpieza)
 *
 * Lee los libros ya normalizados por `limpiar-excel.mjs` y produce el dataset
 * tipado que consume la capa de datos de la aplicación (`src/lib/om/`).
 *
 * Toda la interpretación de formato —celdas combinadas, hojas duplicadas, filas
 * de totales, fechas en cinco redacciones distintas— ocurre en el paso de
 * limpieza. Aquí cada fila es ya una oportunidad de mejora completa y cada
 * encabezado de corte trae su fecha en ISO, así que este script solo traduce
 * columnas a campos.
 *
 * Estructura de las hojas limpias:
 *   PM N° | Vigencia | Fecha de entrega | Fecha de entrega (ISO) | Responsable |
 *   Oportunidad de Mejora | Entregable |
 *   [Observación AAAA-MM-DD · <funcionario> | Clasificación AAAA-MM-DD]×N
 *
 * La clasificación es la escala institucional de avance 0 · 0.5 · 1 · 1.5 · 2.
 */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { leerLibro } from "./lib/xlsx.mjs";
import { SISTEMAS, detectarAreas, limpiar, recortar } from "./lib/dominio.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = join(RAIZ, "data-limpio");
const DESTINO = join(RAIZ, "src", "data", "om-rxd.json");

/** Posición de las columnas fijas en toda hoja limpia. */
const COL = {
  numero: 0,
  vigencia: 1,
  fechaTexto: 2,
  fechaIso: 3,
  responsable: 4,
  oportunidad: 5,
  entregable: 6,
};

/** A partir de aquí se alternan pares observación / clasificación. */
const PRIMER_CORTE = 7;

/**
 * Sufijo estable para las OM que no traen `PM N°`.
 *
 * Usar el número de fila haría que el identificador cambiara al insertar o
 * quitar cualquier fila anterior; derivarlo del texto de la oportunidad lo
 * mantiene fijo mientras el texto no cambie. Es un hash corto (djb2), suficiente
 * para distinguir un puñado de registros dentro de una misma vigencia.
 */
function sufijoEstable(texto) {
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
  return `sn${h.toString(36).slice(0, 6)}`;
}

/** Lee los cortes desde los encabezados ya normalizados. */
function leerCortes(encabezados) {
  const cortes = [];

  for (let col = PRIMER_CORTE; col < encabezados.length; col += 2) {
    const cabecera = limpiar(encabezados[col]);
    const partes = cabecera.match(/^Observaci[oó]n\s+(\d{4}-\d{2}-\d{2})(?:\s*·\s*(.*))?$/i);
    if (!partes) continue;

    cortes.push({
      fecha: partes[1],
      funcionario: limpiar(partes[2]) || "Sin registrar",
      colObservacion: col,
      colClasificacion: col + 1,
    });
  }

  return cortes;
}

function procesarHoja(hoja, sistema) {
  const filas = hoja.filas.filter((f) => f && f.some((c) => c != null && c !== ""));
  if (filas.length < 2) return [];

  const cortes = leerCortes(filas[0]);

  return filas.slice(1).map((fila) => {
    const numeroTexto = limpiar(fila[COL.numero]);
    const numero = /^\d+$/.test(numeroTexto) ? Number(numeroTexto) : null;
    const vigencia = limpiar(fila[COL.vigencia]) || null;
    const responsable = limpiar(fila[COL.responsable]);
    const fechaIso = limpiar(fila[COL.fechaIso]);

    const seguimientos = cortes
      .map((corte) => {
        const bruto = fila[corte.colClasificacion];
        const clasificacion =
          bruto === "" || bruto == null || !Number.isFinite(Number(bruto)) ? null : Number(bruto);
        const observacion = recortar(limpiar(fila[corte.colObservacion]));
        if (clasificacion === null && !observacion) return null;

        return {
          corte: corte.fecha,
          corteTexto: corte.fecha,
          funcionario: corte.funcionario,
          observacion,
          clasificacion,
        };
      })
      .filter(Boolean);

    const oportunidad = limpiar(fila[COL.oportunidad]);

    return {
      id: `${sistema.id}-${vigencia ?? "sv"}-${numero ?? sufijoEstable(oportunidad)}`,
      vigencia,
      numero,
      fechaEntrega: fechaIso || null,
      fechaEntregaTexto: limpiar(fila[COL.fechaTexto]),
      responsable,
      areas: detectarAreas(responsable),
      oportunidad,
      entregable: limpiar(fila[COL.entregable]),
      seguimientos,
    };
  });
}

function main() {
  const archivos = readdirSync(ORIGEN).filter((f) => f.toLowerCase().endsWith(".xlsx"));
  const sistemas = [];
  const avisos = [];

  for (const definicion of SISTEMAS) {
    const archivo = archivos.find((f) => f === `${definicion.id}.xlsx`);
    if (!archivo) {
      avisos.push(`Falta data-limpio/${definicion.id}.xlsx — ¿se ejecutó «pnpm datos:limpiar»?`);
      continue;
    }

    const oms = leerLibro(join(ORIGEN, archivo)).flatMap((hoja) => procesarHoja(hoja, definicion));

    sistemas.push({
      id: definicion.id,
      sigla: definicion.sigla,
      nombre: definicion.nombre,
      archivo,
      oms,
    });
  }

  const dataset = {
    generadoEn: new Date().toISOString().slice(0, 10),
    escalaClasificacion: [0, 0.5, 1, 1.5, 2],
    sistemas,
  };

  mkdirSync(dirname(DESTINO), { recursive: true });
  writeFileSync(DESTINO, `${JSON.stringify(dataset, null, 1)}\n`, "utf8");

  const totalOm = sistemas.reduce((n, s) => n + s.oms.length, 0);
  const totalSeg = sistemas.reduce(
    (n, s) => n + s.oms.reduce((m, o) => m + o.seguimientos.length, 0),
    0,
  );
  console.log(`✓ ${DESTINO}`);
  console.log(`  ${sistemas.length} sistemas · ${totalOm} OM · ${totalSeg} registros de seguimiento`);
  for (const sistema of sistemas) {
    const vigencias = [...new Set(sistema.oms.map((o) => o.vigencia))].filter(Boolean).sort();
    console.log(
      `  · ${sistema.sigla.padEnd(6)} ${String(sistema.oms.length).padStart(3)} OM  [${vigencias.join(", ")}]`,
    );
  }
  for (const aviso of avisos) console.log(`  ! ${aviso}`);
}

main();
