import type { OportunidadMejora } from "@/types";
import { estadoDeOM, formatearPorcentaje } from "@/lib/om/avance";
import { resumen } from "@/lib/om/metricas";

/**
 * Cálculo de los indicadores de gestión de la vista Indicadores.
 *
 * Vive colocado dentro de la vista porque solo esta lo usa (regla scaffolding
 * §3.2). Si otra vista llegara a necesitarlo, se promueve a `src/lib/om/`.
 */

export type EstadoIndicador = "ok" | "caution" | "alert";

export interface Indicador {
  id: string;
  nombre: string;
  /** Valor ya formateado para mostrar. */
  valor: string;
  /** Umbral de lectura con el que se contrasta el valor. */
  referencia: string;
  estado: EstadoIndicador;
  /** Población sobre la que se calcula: hace auditable el indicador. */
  base: string;
}

/** Evalúa un porcentaje contra dos umbrales descendentes. */
function evaluarPorcentaje(valor: number | null, bueno: number, aceptable: number): EstadoIndicador {
  if (valor === null) return "caution";
  if (valor >= bueno) return "ok";
  return valor >= aceptable ? "caution" : "alert";
}

/** Evalúa un conteo que idealmente debe ser cero. */
function evaluarConteo(valor: number, tolerancia: number): EstadoIndicador {
  if (valor === 0) return "ok";
  return valor <= tolerancia ? "caution" : "alert";
}

/**
 * Construye la batería de indicadores sobre el conjunto de OM ya filtrado.
 *
 * Las referencias son **umbrales de lectura** definidos para este tablero, no
 * metas institucionales aprobadas: sirven para ordenar la atención, y la vista
 * lo declara explícitamente.
 */
export function construirIndicadores(oms: OportunidadMejora[]): Indicador[] {
  const datos = resumen(oms);
  const total = datos.total;

  const conSeguimiento = oms.filter((om) =>
    om.seguimientos.some((seguimiento) => seguimiento.clasificacion !== null),
  ).length;
  const cobertura = total === 0 ? null : (conSeguimiento / total) * 100;

  const vigenciaActual = datos.vigencias[datos.vigencias.length - 1];
  const heredadas = oms.filter(
    (om) => vigenciaActual !== undefined && om.vigencia < vigenciaActual && estadoDeOM(om) !== "cumplida",
  ).length;

  const conFechaEvaluable = total - datos.sinFechaEvaluable;

  return [
    {
      id: "tasa-cierre",
      nombre: "Tasa de cierre de oportunidades de mejora",
      valor: formatearPorcentaje(datos.tasaCierre, 1),
      referencia: "≥ 80 %",
      estado: evaluarPorcentaje(datos.tasaCierre, 80, 60),
      base: `${datos.cumplidas} cumplidas de ${total}`,
    },
    {
      id: "avance-promedio",
      nombre: "Avance promedio del portafolio",
      valor: formatearPorcentaje(datos.avancePromedio, 1),
      referencia: "≥ 80 %",
      estado: evaluarPorcentaje(datos.avancePromedio, 80, 60),
      base: `${total - datos.sinSeguimiento} con calificación`,
    },
    {
      id: "cobertura-seguimiento",
      nombre: "Cobertura de seguimiento",
      valor: formatearPorcentaje(cobertura, 1),
      referencia: "100 %",
      estado: evaluarPorcentaje(cobertura, 100, 90),
      base: `${conSeguimiento} de ${total} con al menos un corte calificado`,
    },
    {
      id: "sin-avance",
      nombre: "Oportunidades sin avance registrado",
      valor: String(datos.sinAvance),
      referencia: "0",
      estado: evaluarConteo(datos.sinAvance, 2),
      base: "Calificación vigente igual a 0 en la escala institucional",
    },
    {
      id: "sin-seguimiento",
      nombre: "Oportunidades sin ningún seguimiento",
      valor: String(datos.sinSeguimiento),
      referencia: "0",
      estado: evaluarConteo(datos.sinSeguimiento, 0),
      base: "Sin ninguna calificación registrada en los cortes de seguimiento",
    },
    {
      id: "vencidas",
      nombre: "Entrega comprometida vencida y sin cierre",
      valor: String(datos.vencidas),
      referencia: "0",
      estado: evaluarConteo(datos.vencidas, 2),
      base:
        conFechaEvaluable > 0
          ? `${conFechaEvaluable} OM con fecha evaluable · ${datos.sinFechaEvaluable} con compromiso en texto libre`
          : "Ninguna OM registra una fecha de entrega evaluable",
    },
    {
      id: "heredadas",
      nombre: "Oportunidades de vigencias anteriores aún sin cerrar",
      valor: String(heredadas),
      referencia: "0",
      estado: evaluarConteo(heredadas, 3),
      base: vigenciaActual
        ? `Vigencias anteriores a ${vigenciaActual}`
        : "Sin vigencias registradas",
    },
    {
      id: "cortes",
      nombre: "Cortes de seguimiento registrados",
      valor: String(datos.cortes.length),
      referencia: "Informativo",
      estado: "ok",
      base: datos.cortes.length > 0 ? `Del ${datos.cortes[0]} al ${datos.ultimoCorte}` : "Sin cortes",
    },
  ];
}
