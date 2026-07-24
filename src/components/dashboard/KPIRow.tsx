import type { DashboardData } from "@/features/dashboard/dashboardData";

/**
 * Fila de indicadores clave (KPIs) reutilizable (regla dashboard §5).
 * Abre todos los dashboards; normalmente se usa vía `DashboardShell`.
 */
export function KPIRow({ kpis }: { kpis: DashboardData["kpis"] }) {
  return (
    <div className="kpi-row">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="kpi">
          <div className="k-label">{kpi.label}</div>
          <div className="k-val">{kpi.value}</div>
          <div className={`k-delta ${kpi.delta.type}`}>
            <span className="muted">{kpi.delta.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
