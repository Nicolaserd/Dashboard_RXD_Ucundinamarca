/**
 * Reglas de dominio compartidas por el pipeline de datos.
 *
 *   data/*.xlsx  →  [limpiar-excel]  →  data-limpio/*.xlsx  →  [importar]  →  src/data/om-rxd.json
 *
 * Ambos pasos necesitan las mismas definiciones (qué sistemas hay, cómo se
 * normaliza una fecha, qué áreas existen), así que viven aquí una sola vez.
 */
import { fechaDesdeSerial } from "./xlsx.mjs";

/**
 * Longitud máxima de las observaciones. Acota el peso del dataset que viaja al
 * cliente: son narrativas largas y repetitivas de las que la interfaz solo
 * muestra el arranque. El texto íntegro permanece en los libros de `data/`.
 */
export const MAX_OBSERVACION = 400;

/**
 * Sistemas de gestión reconocidos, identificados por el nombre del archivo.
 * El orden define el orden de aparición en la portada de temas.
 */
export const SISTEMAS = [
  { id: "sgc", sigla: "SGC", nombre: "Sistema de Gestión de Calidad", patron: /_SGC/i },
  { id: "sga", sigla: "SGA", nombre: "Sistema de Gestión Ambiental", patron: /_SGA[\s_]/i },
  { id: "sgsst", sigla: "SG-SST", nombre: "Seguridad y Salud en el Trabajo", patron: /SG[\s-]*SST/i },
  { id: "sgsi", sigla: "SGSI", nombre: "Seguridad de la Información", patron: /SG\s*SI\b/i },
  { id: "sgas", sigla: "SGAS", nombre: "Sistema de Gestión Antisoborno", patron: /_SGAS/i },
];

/**
 * Áreas institucionales canónicas. El campo «Responsable» es texto libre y con
 * 95 variantes distintas no sirve como dimensión de análisis, así que cada OM
 * se etiqueta con todas las áreas que menciona. El orden es indiferente: se
 * evalúan todos los patrones y una OM puede pertenecer a varias áreas.
 */
export const AREAS = [
  ["Alta Dirección", /alta\s*direcci/i],
  ["Planeación Institucional", /planeaci[oó]n/i],
  ["Sistemas y Tecnología", /sistemas\s+y\s+tecnolog|comit[eé]\s+de\s+sistemas/i],
  ["Talento Humano", /talento\s+humano/i],
  ["Control Interno", /control\s+interno/i],
  ["Calidad", /calidad/i],
  ["Gestión Ambiental", /\bsga\b|gesti[oó]n\s+ambiental|oficina\s+ambiental/i],
  ["Seguridad de la Información", /\bsgsi\b|seguridad\s+de\s+la\s+informaci/i],
  ["Seguridad y Salud en el Trabajo", /sg[\s-]*sst|seguridad\s+y\s+salud|\bsst\b/i],
  ["Antisoborno", /antisoborno/i],
  ["Vicerrectoría Académica", /vice?rrector[íi]a\s+acad|vicerectoria\s+acad/i],
  ["Vicerrectoría Administrativa y Financiera", /vice?rrector[íi]a\s+(administrativa|financiera)|vicerectoria\s+administrativa|director\s+administrativo/i],
  ["Bienes, Servicios y Compras", /bienes\s+y\s+servicios|compras/i],
  ["Recursos Físicos", /recursos\s+f[íi]sicos/i],
  ["Apoyo y Desarrollo Académico", /apoyo\s+acad[eé]mico|desarrollo\s+acad[eé]mico|\bacademia\b|pr[áa]cticas\s+acad/i],
  ["Atención al Ciudadano", /atenci[oó]n\s+al\s+ciudadano/i],
  ["Archivo y Correspondencia", /archivo/i],
  ["Investigación Universitaria", /investigaci[oó]n/i],
  ["Interacción Social y Bienestar", /interacci[oó]n\s+social|bienestar/i],
  ["Autoevaluación y Acreditación", /autoevaluaci|acreditaci/i],
  ["Educación Virtual y EFAD", /educaci[oó]n\s+virtual|\befad\b/i],
  ["Admisiones y Registro", /admisiones/i],
  ["Gobierno de Datos", /gobierno\s+(de\s+)?datos/i],
  ["Cuerpos Colegiados y Comités", /cuerpos\s+colegiados|comit[eé]\s+sac|comisi[oó]n\s+de\s+gesti[oó]n/i],
  ["Dirección Jurídica", /jur[íi]dica/i],
  ["Contabilidad", /contabilidad/i],
];

const MESES = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, setiembre: 9, octubre: 10,
  noviembre: 11, diciembre: 12,
};

/** Colapsa espacios y recorta; convierte `null`/`undefined` en cadena vacía. */
export const limpiar = (valor) => String(valor ?? "").replace(/\s+/g, " ").trim();

const iso = (anio, mes, dia) => {
  if (!anio || !mes || !dia || mes > 12 || dia > 31) return null;
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
};

/**
 * Normaliza una fecha de origen heterogéneo (serial de Excel, `dd/mm/aaaa`,
 * `dd-mm-aaaa` o `30 de junio 2026`). Devuelve `null` cuando el texto no es una
 * fecha (p. ej. «Inmediato», «Vigencia 2025», «IPA 2025»), en cuyo caso la
 * aplicación conserva y muestra el texto original.
 */
export function normalizarFecha(valor) {
  if (valor == null || valor === "") return null;

  // Serial de Excel. Se acota al rango razonable de estos libros (2015–2035).
  if (typeof valor === "number") {
    return valor > 42000 && valor < 50000 ? fechaDesdeSerial(valor) : null;
  }

  const texto = limpiar(valor);
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto; // ya normalizada

  // dd/mm/aaaa · dd-mm-aaaa (tolera espacios sobrantes y separadores mixtos)
  const numerica = texto.match(/^(\d{1,2})\s*[/-]\s*(\d{1,2})\s*[/-]?\s*(\d{4})$/);
  if (numerica) return iso(Number(numerica[3]), Number(numerica[2]), Number(numerica[1]));

  const nombreMes = Object.keys(MESES).join("|");
  const diaMesAnio = texto.match(new RegExp(`(\\d{1,2})\\s*(?:de\\s+)?(${nombreMes})\\s*(?:de\\s+)?(\\d{4})`, "i"));
  if (diaMesAnio) return iso(Number(diaMesAnio[3]), MESES[diaMesAnio[2].toLowerCase()], Number(diaMesAnio[1]));

  const mesDiaAnio = texto.match(new RegExp(`(${nombreMes})\\s+(\\d{1,2})\\s*(?:de\\s+)?(\\d{4})`, "i"));
  if (mesDiaAnio) return iso(Number(mesDiaAnio[3]), MESES[mesDiaAnio[1].toLowerCase()], Number(mesDiaAnio[2]));

  return null;
}

/** Áreas canónicas mencionadas en el texto libre de «Responsable». */
export function detectarAreas(responsable) {
  const areas = AREAS.filter(([, patron]) => patron.test(responsable)).map(([nombre]) => nombre);
  return areas.length > 0 ? areas : ["Otras áreas"];
}

export const recortar = (texto) =>
  texto.length > MAX_OBSERVACION ? `${texto.slice(0, MAX_OBSERVACION).trimEnd()}…` : texto;

/** Vigencia (año del ciclo RXD) a partir del nombre de la hoja. */
export const vigenciaDeHoja = (nombre) => nombre.match(/(20\d{2})/)?.[1] ?? null;
