import type { Clasificacion, EstadoAvance, OportunidadMejora } from "@/types";
import {
  CLASIFICACION_MAXIMA,
  ESTADOS,
  avanceDeOM,
  avancePromedio,
  estadoDeOM,
  ultimoSeguimientoCalificado,
} from "./avance";
import { ultimoCorte } from "./dataset";

/**
 * Agregaciones puras sobre las OM. Son funciones sin estado ni dependencia de
 * React: las vistas solo las consumen (SOLID «S» — la gráfica pinta, no calcula
 * de dónde salen los datos).
 */

export interface ResumenOM {
  total: number;
  cumplidas: number;
  enGestion: number;
  sinAvance: number;
  sinSeguimiento: number;
  /** Porcentaje de OM cumplidas sobre el total. */
  tasaCierre: number | null;
  /** Avance promedio (0–100) de las OM calificadas. */
  avancePromedio: number | null;
  /** OM con fecha comprometida ya vencida y aún sin cerrar. */
  vencidas: number;
  /** OM cuya fecha de entrega es texto libre y no se puede evaluar. */
  sinFechaEvaluable: number;
  vigencias: string[];
  cortes: string[];
  ultimoCorte: string | null;
}

/**
 * ¿La OM incumplió su fecha comprometida?
 *
 * Se compara contra la fecha del último corte de seguimiento (no contra «hoy»):
 * es el momento en que la institución evaluó por última vez el estado, así que
 * es la referencia honesta para afirmar un incumplimiento. Las OM cuya fecha de
 * entrega se registró como texto libre («Inmediato», «IPA 2025») no se evalúan.
 */
export function estaVencida(om: OportunidadMejora, referencia: string | null): boolean {
  if (!referencia || !om.fechaEntrega) return false;
  return om.fechaEntrega < referencia && estadoDeOM(om) !== "cumplida";
}

export function resumen(oms: OportunidadMejora[]): ResumenOM {
  const referencia = ultimoCorte(oms);
  const estados = oms.map(estadoDeOM);
  const cuenta = (predicado: (estado: EstadoAvance) => boolean) => estados.filter(predicado).length;
  const cumplidas = cuenta((estado) => estado === "cumplida");

  return {
    total: oms.length,
    cumplidas,
    enGestion: cuenta((estado) =>
      estado === "avance-minimo" || estado === "avance-parcial" || estado === "avance-significativo",
    ),
    sinAvance: cuenta((estado) => estado === "sin-avance"),
    sinSeguimiento: cuenta((estado) => estado === "sin-seguimiento"),
    tasaCierre: oms.length === 0 ? null : (cumplidas / oms.length) * 100,
    avancePromedio: avancePromedio(oms),
    vencidas: oms.filter((om) => estaVencida(om, referencia)).length,
    sinFechaEvaluable: oms.filter((om) => !om.fechaEntrega).length,
    vigencias: [...new Set(oms.map((om) => om.vigencia))].sort(),
    cortes: cortesDe(oms),
    ultimoCorte: referencia,
  };
}

/** Fechas de corte distintas presentes en un conjunto de OM, en orden cronológico. */
export function cortesDe(oms: OportunidadMejora[]): string[] {
  const cortes = new Set<string>();
  for (const om of oms) for (const seguimiento of om.seguimientos) cortes.add(seguimiento.corte);
  return [...cortes].sort();
}

/**
 * Clasificación vigente de una OM **a una fecha de corte dada**: la última
 * calificación registrada en ese corte o antes. Devuelve `null` si en esa fecha
 * la OM aún no había sido calificada.
 */
export function clasificacionEnCorte(om: OportunidadMejora, corte: string): Clasificacion | null {
  let vigente: Clasificacion | null = null;
  for (const seguimiento of om.seguimientos) {
    if (seguimiento.corte > corte) break;
    if (seguimiento.clasificacion !== null) vigente = seguimiento.clasificacion;
  }
  return vigente;
}

export interface PuntoAvance {
  corte: string;
  /** Avance promedio del portafolio a esa fecha (0–100). */
  avance: number;
  /** Tasa de cierre a esa fecha (0–100). */
  tasaCierre: number;
  /** OM ya calificadas a esa fecha: base sobre la que se calcula el punto. */
  base: number;
  cumplidas: number;
}

/**
 * Evolución del estado del portafolio corte a corte.
 *
 * Cada punto es una foto **acumulada**: para cada OM se toma su última
 * calificación en ese corte o antes, no solo lo que se calificó ese día. Así la
 * curva describe cómo avanzó el conjunto y no el ritmo de trabajo del evaluador.
 * `base` viaja con el punto para que el tooltip declare cuántas OM lo sustentan.
 */
export function serieAvancePorCorte(oms: OportunidadMejora[]): PuntoAvance[] {
  return cortesDe(oms)
    .map((corte) => {
      const vigentes = oms
        .map((om) => clasificacionEnCorte(om, corte))
        .filter((clasificacion): clasificacion is Clasificacion => clasificacion !== null);

      if (vigentes.length === 0) return null;

      const suma = vigentes.reduce<number>((total, clasificacion) => total + clasificacion, 0);
      const cumplidas = vigentes.filter((clasificacion) => clasificacion === CLASIFICACION_MAXIMA).length;

      return {
        corte,
        avance: Number((((suma / vigentes.length) / CLASIFICACION_MAXIMA) * 100).toFixed(1)),
        tasaCierre: Number(((cumplidas / vigentes.length) * 100).toFixed(1)),
        base: vigentes.length,
        cumplidas,
      };
    })
    .filter((punto): punto is PuntoAvance => punto !== null);
}

/** Variación entre los dos últimos cortes de una serie, en puntos porcentuales. */
export function variacionUltimoCorte(
  serie: PuntoAvance[],
  campo: "avance" | "tasaCierre",
): number | null {
  if (serie.length < 2) return null;
  const ultimo = serie[serie.length - 1];
  const previo = serie[serie.length - 2];
  if (!ultimo || !previo) return null;
  return Number((ultimo[campo] - previo[campo]).toFixed(1));
}

export interface SegmentoEstado {
  estado: EstadoAvance;
  clave: string;
  name: string;
  value: number;
  color: string;
}

/** Distribución de las OM por estado vigente; omite los estados sin registros. */
export function distribucionPorEstado(oms: OportunidadMejora[]): SegmentoEstado[] {
  const conteo = new Map<EstadoAvance, number>();
  for (const om of oms) {
    const estado = estadoDeOM(om);
    conteo.set(estado, (conteo.get(estado) ?? 0) + 1);
  }

  return ESTADOS.filter((estado) => (conteo.get(estado.id) ?? 0) > 0).map((estado) => ({
    estado: estado.id,
    clave: estado.id,
    name: estado.label,
    value: conteo.get(estado.id) ?? 0,
    color: estado.color,
  }));
}

export interface AgrupacionAvance {
  /** Valor de la dimensión (vigencia o área) — actúa también como filtro. */
  clave: string;
  total: number;
  cumplidas: number;
  sinCerrar: number;
  avance: number;
}

function agrupar(
  oms: OportunidadMejora[],
  clavesDe: (om: OportunidadMejora) => string[],
): AgrupacionAvance[] {
  const grupos = new Map<string, { total: number; cumplidas: number; avances: number[] }>();

  for (const om of oms) {
    const avance = avanceDeOM(om);
    const cumplida = estadoDeOM(om) === "cumplida";
    for (const clave of clavesDe(om)) {
      const grupo = grupos.get(clave) ?? { total: 0, cumplidas: 0, avances: [] };
      grupo.total += 1;
      if (cumplida) grupo.cumplidas += 1;
      if (avance !== null) grupo.avances.push(avance);
      grupos.set(clave, grupo);
    }
  }

  return [...grupos.entries()].map(([clave, { total, cumplidas, avances }]) => ({
    clave,
    total,
    cumplidas,
    sinCerrar: total - cumplidas,
    avance:
      avances.length === 0
        ? 0
        : Number((avances.reduce((suma, valor) => suma + valor, 0) / avances.length).toFixed(1)),
  }));
}

/** Avance por vigencia del ciclo de RXD, en orden cronológico. */
export function avancePorVigencia(oms: OportunidadMejora[]): AgrupacionAvance[] {
  return agrupar(oms, (om) => [om.vigencia]).sort((a, b) => a.clave.localeCompare(b.clave));
}

/**
 * Avance por área responsable. Una OM con varias áreas cuenta en todas, por lo
 * que la suma de `total` supera el número de OM: mide carga por área, no una
 * partición del total.
 */
export function avancePorArea(oms: OportunidadMejora[], limite?: number): AgrupacionAvance[] {
  const areas = agrupar(oms, (om) => om.areas).sort(
    (a, b) => b.total - a.total || a.clave.localeCompare(b.clave, "es"),
  );
  return limite ? areas.slice(0, limite) : areas;
}

export interface HitoCorte extends PuntoAvance {
  /** OM que recibieron calificación nueva en ese corte. */
  calificadasEnElCorte: number;
  funcionarios: string[];
  /** Variación del avance respecto al corte anterior, en puntos porcentuales. */
  variacion: number | null;
}

/** Cortes de seguimiento como hitos, del más reciente al más antiguo. */
export function hitosPorCorte(oms: OportunidadMejora[]): HitoCorte[] {
  const serie = serieAvancePorCorte(oms);
  const actividad = new Map<string, { calificadas: number; funcionarios: Set<string> }>();

  for (const om of oms) {
    for (const seguimiento of om.seguimientos) {
      const registro = actividad.get(seguimiento.corte) ?? { calificadas: 0, funcionarios: new Set<string>() };
      if (seguimiento.clasificacion !== null) registro.calificadas += 1;
      registro.funcionarios.add(seguimiento.funcionario);
      actividad.set(seguimiento.corte, registro);
    }
  }

  return serie
    .map((punto, indice) => {
      const registro = actividad.get(punto.corte);
      const previo = indice > 0 ? serie[indice - 1] : undefined;
      return {
        ...punto,
        calificadasEnElCorte: registro?.calificadas ?? 0,
        funcionarios: [...(registro?.funcionarios ?? [])],
        variacion: previo ? Number((punto.avance - previo.avance).toFixed(1)) : null,
      };
    })
    .reverse();
}

/**
 * OM ordenadas por prioridad de atención: primero las más rezagadas y, a
 * igualdad de avance, las de vigencia más antigua.
 */
export function ordenarPorRezago(oms: OportunidadMejora[]): OportunidadMejora[] {
  return [...oms].sort((a, b) => {
    const avanceA = avanceDeOM(a) ?? -1;
    const avanceB = avanceDeOM(b) ?? -1;
    if (avanceA !== avanceB) return avanceA - avanceB;
    return a.vigencia.localeCompare(b.vigencia);
  });
}

/** Última observación registrada para una OM (la de su corte más reciente). */
export function ultimaObservacion(om: OportunidadMejora): string {
  const seguimiento = ultimoSeguimientoCalificado(om) ?? om.seguimientos[om.seguimientos.length - 1];
  return seguimiento?.observacion ?? "";
}
