import type { ReactNode } from "react";
import { KPIRow } from "./KPIRow";
import { FilterBar, type FilterConfig } from "./FilterBar";
import type { DashboardData } from "@/features/dashboard/dashboardData";

interface DashboardShellProps {
  /** Indicadores clave que abren el dashboard (regla dashboard §5). */
  kpis: DashboardData["kpis"];
  /** Filtros de la vista. Opcionales: no todo dashboard los necesita (§6). */
  filtros?: FilterConfig[];
  /** Contenido propio de la vista: gráficas, tablas, listados. */
  children: ReactNode;
}

/**
 * Estructura común de todo dashboard: KPIs arriba, filtros debajo y luego el
 * detalle de la vista (regla dashboard §5–7).
 *
 * Evita repetir el mismo preámbulo en cada vista (DRY — CLAUDE.md §6) y
 * garantiza que el orden de lectura sea idéntico en toda la aplicación.
 *
 * @example
 * <DashboardShell kpis={data.kpis} filtros={[FILTRO_PERIODO]}>
 *   <div className="grid-2b">…</div>
 * </DashboardShell>
 */
export function DashboardShell({ kpis, filtros, children }: DashboardShellProps) {
  return (
    <>
      <KPIRow kpis={kpis} />
      {filtros && filtros.length > 0 && <FilterBar filters={filtros} />}
      {children}
    </>
  );
}
