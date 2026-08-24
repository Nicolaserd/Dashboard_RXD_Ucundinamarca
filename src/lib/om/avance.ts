import type { Clasificacion, EstadoAvance, OportunidadMejora, SeguimientoOM } from "@/types";

/**
 * Lectura de la escala institucional de avance (0 – 2) y su traducción a
 * estados, etiquetas y color. Fuente única para toda la aplicación: ninguna
 * gráfica ni tabla define su propia paleta de estados (regla dashboard §10).
 */

/** Clasificación máxima de la escala: una OM cumplida. */
export const CLASIFICACION_MAXIMA = 2;

interface DefinicionEstado {
  id: EstadoAvance;
  /** Clasificación exacta que produce el estado. */
  clasificacion: Clasificacion;
  label: string;
  /**
   * Paso de la rampa ordinal de avance (tokens en `globals.css`).
   *
   * El avance es una magnitud ordenada, no una identidad: por eso la escala es
   * una **rampa secuencial de un solo tono** derivada del verde institucional,
   * con luminosidad monótona, y no una paleta de colores distintos. Una paleta
   * categórica aquí sería incorrecta —y de hecho medía ΔE 5.8 entre dos de sus
   * verdes, indistinguibles incluso con visión de color completa—.
   */
  color: string;
  /**
   * Refuerzo NO cromático de la posición en la escala (regla dashboard §8–9,
   * §11): el relleno del símbolo crece con el avance, de modo que la categoría
   * se distingue sin depender del color.
   */
  simbolo: string;
}

/**
 * Escala completa, de mayor a menor avance. Una OM que nunca fue calificada
 * cuenta como «Sin avance» (clasificación 0): no hay un estado aparte para
 * «sin seguimiento», por decisión explícita — ver `clasificacionFinal`.
 */
export const ESTADOS: DefinicionEstado[] = [
  { id: "cumplida", clasificacion: 2, label: "Cumplida", color: "var(--uc-avance-4)", simbolo: "●" },
  { id: "avance-significativo", clasificacion: 1.5, label: "Avance significativo", color: "var(--uc-avance-3)", simbolo: "◕" },
  { id: "avance-parcial", clasificacion: 1, label: "Avance parcial", color: "var(--uc-avance-2)", simbolo: "◑" },
  { id: "avance-minimo", clasificacion: 0.5, label: "Avance mínimo", color: "var(--uc-avance-1)", simbolo: "◔" },
  { id: "sin-avance", clasificacion: 0, label: "Sin avance", color: "var(--uc-avance-0)", simbolo: "○" },
];

const POR_ID = new Map(ESTADOS.map((estado) => [estado.id, estado]));
const SIN_AVANCE = ESTADOS[ESTADOS.length - 1] as DefinicionEstado;

export function estadoPorId(id: EstadoAvance): DefinicionEstado {
  // La escala cubre todos los valores posibles; el fallback solo satisface al tipo.
  return POR_ID.get(id) ?? SIN_AVANCE;
}

export const etiquetaEstado = (id: EstadoAvance): string => estadoPorId(id).label;
export const colorEstado = (id: EstadoAvance): string => estadoPorId(id).color;
export const simboloEstado = (id: EstadoAvance): string => estadoPorId(id).simbolo;

/**
 * Gris neutro para una **observación puntual de un corte** sin calificación
 * numérica (columna `CLASIFICACION` vacía en ese corte). Es un concepto
 * distinto del estado de la OM: una OM puede tener su calificación vigente en
 * «Sin avance» y aun así traer observaciones sin calificar en cortes previos.
 */
const SIN_CALIFICAR = { color: "var(--uc-avance-nd)", simbolo: "–" };

function porClasificacion(clasificacion: number | null): { color: string; simbolo: string } {
  if (clasificacion === null) return SIN_CALIFICAR;
  return ESTADOS.find((estado) => estado.clasificacion === clasificacion) ?? SIN_AVANCE;
}

export const colorClasificacion = (clasificacion: number | null): string =>
  porClasificacion(clasificacion).color;

export const simboloClasificacion = (clasificacion: number | null): string =>
  porClasificacion(clasificacion).simbolo;

/** Último corte de una OM que sí calificó el avance. */
export function ultimoSeguimientoCalificado(om: OportunidadMejora): SeguimientoOM | null {
  for (let i = om.seguimientos.length - 1; i >= 0; i--) {
    const seguimiento = om.seguimientos[i];
    if (seguimiento && seguimiento.clasificacion !== null) return seguimiento;
  }
  return null;
}

/**
 * Clasificación vigente de una OM. Una OM que nunca fue calificada cuenta
 * como **0** (Sin avance): no se distingue de una calificada explícitamente
 * con 0, por decisión del tablero (antes eran «Sin seguimiento» aparte).
 */
export function clasificacionFinal(om: OportunidadMejora): Clasificacion {
  return ultimoSeguimientoCalificado(om)?.clasificacion ?? 0;
}

/** Estado vigente de una OM según su última clasificación (0 si nunca se calificó). */
export function estadoDeOM(om: OportunidadMejora): EstadoAvance {
  const clasificacion = clasificacionFinal(om);
  return ESTADOS.find((estado) => estado.clasificacion === clasificacion)?.id ?? "sin-avance";
}

/** Avance porcentual de una OM (0–100). 0 si nunca fue calificada. */
export function avanceDeOM(om: OportunidadMejora): number {
  return (clasificacionFinal(om) / CLASIFICACION_MAXIMA) * 100;
}

/** Avance promedio (0–100) de un conjunto de OM; `null` solo si el conjunto está vacío. */
export function avancePromedio(oms: OportunidadMejora[]): number | null {
  if (oms.length === 0) return null;
  return oms.reduce((suma, om) => suma + avanceDeOM(om), 0) / oms.length;
}

/** Formatea un porcentaje con el símbolo `%` (regla dashboard §2). */
export function formatearPorcentaje(valor: number | null, decimales = 1): string {
  return valor === null ? "Sin dato" : `${valor.toFixed(decimales)}%`;
}

/** Formatea una fecha ISO como `30 jun 2026` (regla dashboard §2). */
export function formatearFecha(iso: string | null): string {
  if (!iso) return "Sin fecha";
  const [anio, mes, dia] = iso.split("-");
  const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${Number(dia)} ${MESES[Number(mes) - 1] ?? ""} ${anio}`;
}

/**
 * Compromiso de entrega en forma legible.
 *
 * Cuando el libro de origen registró una fecha se muestra formateada; cuando
 * registró texto libre («Inmediato», «IPA 2025») se muestra tal cual, porque es
 * el compromiso real que asumió el área. Nunca se expone el número de serie de
 * Excel que hay detrás de la celda.
 */
export function entregaLegible(
  om: Pick<OportunidadMejora, "fechaEntrega" | "fechaEntregaTexto">,
): string {
  if (om.fechaEntrega) return formatearFecha(om.fechaEntrega);
  return om.fechaEntregaTexto || "Sin registrar";
}
