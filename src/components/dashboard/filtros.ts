import type { FilterConfig } from "./FilterBar";

/**
 * Utilidades de filtros compartidas entre dashboards (regla dashboard §4, §6).
 *
 * Las opciones de un filtro se derivan de los datos reales de la vista, de modo
 * que siempre coinciden con lo que hay para filtrar (evita filtros que «no
 * sirven» porque su valor no existe en el dataset). DRY — CLAUDE.md §6.
 */

/**
 * Construye un filtro a partir de los valores presentes en los datos.
 * Deduplica preservando el orden de aparición; usa el propio valor como etiqueta.
 *
 * @example
 * const filtroSede = construirFiltro("sede", "Sede", data.tablaDetallada.map((r) => r.sede));
 */
export function construirFiltro(id: string, label: string, valores: string[]): FilterConfig {
  const vistos = new Set<string>();
  const options = valores
    .filter((v) => (vistos.has(v) ? false : (vistos.add(v), true)))
    .map((v) => ({ value: v, label: v }));
  return { id, label, options };
}
