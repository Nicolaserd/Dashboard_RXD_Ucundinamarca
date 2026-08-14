import type { EstadoAvance, OportunidadMejora } from "@/types";
import { estadoDeOM } from "./avance";

/**
 * Modelo de filtros del tablero de OM. Es el mismo para todas las vistas, de
 * modo que una selección hecha en una gráfica se refleja en el resto del
 * tablero sin filtros duplicados (regla dashboard §3–4, §6).
 */
export type FiltrosOM = {
  vigencia: string;
  estado: EstadoAvance | "";
  area: string;
};

export const FILTROS_VACIOS: FiltrosOM = { vigencia: "", estado: "", area: "" };

/** Identificadores de filtro admitidos, para enlazar controles y gráficas. */
export type CampoFiltro = keyof FiltrosOM;

export function hayFiltrosActivos(filtros: FiltrosOM): boolean {
  return Boolean(filtros.vigencia || filtros.estado || filtros.area);
}

/** Aplica los filtros activos; los campos vacíos no restringen nada. */
export function aplicarFiltros(oms: OportunidadMejora[], filtros: FiltrosOM): OportunidadMejora[] {
  return oms.filter((om) => {
    if (filtros.vigencia && om.vigencia !== filtros.vigencia) return false;
    if (filtros.area && !om.areas.includes(filtros.area)) return false;
    if (filtros.estado && estadoDeOM(om) !== filtros.estado) return false;
    return true;
  });
}

/** Vigencias presentes en los datos, en orden cronológico. */
export function vigenciasDe(oms: OportunidadMejora[]): string[] {
  return [...new Set(oms.map((om) => om.vigencia))].sort();
}

/** Áreas responsables presentes en los datos, ordenadas por número de OM. */
export function areasDe(oms: OportunidadMejora[]): string[] {
  const conteo = new Map<string, number>();
  for (const om of oms) {
    for (const area of om.areas) conteo.set(area, (conteo.get(area) ?? 0) + 1);
  }
  return [...conteo.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([area]) => area);
}
