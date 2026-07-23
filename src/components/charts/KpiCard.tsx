import type { Kpi } from "@/types";

/** Mini-tendencia del indicador (sparkline). */
function Sparkline({ vals }: { vals: number[] }) {
  const w = 104,
    h = 30;
  const min = Math.min(...vals),
    max = Math.max(...vals),
    rng = max - min || 1;
  const pts = vals.map((v, i) => [(i / (vals.length - 1)) * w, h - 2 - ((v - min) / rng) * (h - 6)] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `M0 ${h} ${pts.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ")} L${w} ${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
      <path d={area} style={{ fill: "rgba(0, 123, 62, 0.10)" }} />
      <path d={d} style={{ stroke: "var(--uc-green)" }} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0].toFixed(1)} cy={last[1].toFixed(1)} r={2.6} style={{ fill: "var(--uc-green)" }} />
    </svg>
  );
}

/** Tarjeta de indicador resumen (KPI). Muestra valor, variación y tendencia. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="kpi">
      <span className="k-label">{kpi.label}</span>
      <span className="k-val">{kpi.value}</span>
      <span className={`k-delta ${kpi.tono}`}>
        {kpi.delta} <span className="muted">vs 2025-II</span>
      </span>
      <span className="k-spark">
        <Sparkline vals={kpi.spark} />
      </span>
    </div>
  );
}
