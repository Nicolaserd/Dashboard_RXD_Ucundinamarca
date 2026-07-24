import type { FilterConfig } from "./FilterBar";

/**
 * Catálogo de filtros compartidos entre dashboards (regla dashboard §6).
 *
 * Única fuente de verdad para las opciones que se repiten en varias vistas
 * (DRY — CLAUDE.md §6). Un filtro propio de una sola vista se declara en esa
 * vista, no aquí.
 *
 * @example
 * <DashboardShell kpis={data.kpis} filtros={[FILTRO_PERIODO, FILTRO_SEDE]}>…</DashboardShell>
 */

/** Período académico. Usado en Resumen, Indicadores y Datos. */
export const FILTRO_PERIODO: FilterConfig = {
  id: "periodo",
  label: "Período",
  options: [
    { value: "2026-I", label: "2026-I" },
    { value: "2025-IV", label: "2025-IV" },
    { value: "2025-III", label: "2025-III" },
  ],
  defaultValue: "2026-I",
};

/** Sede institucional. Usado en Indicadores y Datos. */
export const FILTRO_SEDE: FilterConfig = {
  id: "sede",
  label: "Sede",
  options: [
    { value: "bogota-centro", label: "Bogotá Centro" },
    { value: "bogota-sur", label: "Bogotá Sur" },
    { value: "facatativa", label: "Facatativá" },
    { value: "zipaquira", label: "Zipaquirá" },
  ],
};
