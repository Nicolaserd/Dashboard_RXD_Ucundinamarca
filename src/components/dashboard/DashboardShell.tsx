import type { ReactNode } from "react";
import { KPIRow, type KPI } from "./KPIRow";
import { FilterBar, type FilterConfig } from "./FilterBar";

interface DashboardShellProps {
  /** Indicadores clave que abren el tablero (regla dashboard §5). */
  kpis: KPI[];
  /** Controles de filtro de contexto. Opcionales: no toda vista los necesita (§6). */
  filtros?: FilterConfig[];
  valores?: Record<string, string>;
  onFilterChange?: (filterId: string, value: string) => void;
  onClearAll?: () => void;
  /** Contenido propio de la vista: gráficas, tablas, listados. */
  children: ReactNode;
}

/**
 * Estructura común de todo tablero: KPIs arriba, filtros debajo y luego el
 * detalle de la vista (regla dashboard §5–7).
 *
 * Evita repetir el mismo preámbulo en cada vista (DRY — CLAUDE.md §6) y
 * garantiza que el orden de lectura sea idéntico en toda la aplicación.
 *
 * @example
 * <DashboardShell kpis={kpis} filtros={controles} valores={filtros} onFilterChange={fijar} onClearAll={limpiar}>
 *   <div className="grid-2a">…</div>
 * </DashboardShell>
 */
export function DashboardShell({
  kpis,
  filtros,
  valores,
  onFilterChange,
  onClearAll,
  children,
}: DashboardShellProps) {
  return (
    <>
      <KPIRow kpis={kpis} />
      {filtros && filtros.length > 0 && (
        <FilterBar
          filters={filtros}
          valores={valores ?? {}}
          onChange={onFilterChange ?? (() => {})}
          onClearAll={onClearAll ?? (() => {})}
        />
      )}
      {children}
    </>
  );
}
