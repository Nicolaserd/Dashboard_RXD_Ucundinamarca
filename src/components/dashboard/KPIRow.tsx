/**
 * Fila de indicadores clave (KPIs) reutilizable.
 * Se usa al inicio de todos los dashboards.
 */
interface KPI {
  label: string;
  value: string;
  delta: { label: string; type: "up" | "down-good" | "caution" };
}

export function KPIRow({ kpis }: { kpis: KPI[] }) {
  return (
    <div className="kpi-row">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="kpi">
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
