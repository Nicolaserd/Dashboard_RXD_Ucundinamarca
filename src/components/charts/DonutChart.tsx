"use client";

import { useDashboard } from "@/features/dashboard/DashboardProvider";
import { fmtPct } from "@/lib/format";
import type { Segmento } from "@/types";

/**
 * Composición porcentual (donut). Identidad por categoría con separación de
 * 2px entre segmentos; nunca depende solo del color: leyenda con etiqueta y % (§8–9).
 * La paleta categórica está validada (ΔE CVD ≥ 15).
 */
export function DonutChart({
  data,
  centerValue,
  centerLabel,
}: {
  data: Segmento[];
  centerValue: string;
  centerLabel: string;
}) {
  const { showTip, hideTip } = useDashboard();
  const cx = 110,
    cy = 110,
    r = 74,
    sw = 26;
  const C = 2 * Math.PI * r;
  const gap = 5;
  let off = 0;
  const arcs = data.map((s) => {
    const len = (C * s.value) / 100;
    const dash = Math.max(len - gap, 1);
    const item = { s, dash, off };
    off += len;
    return item;
  });

  return (
    <div className="chart-wrap">
      <svg
        className="chart"
        viewBox="0 0 220 220"
        role="img"
        aria-label="Distribución por nivel académico"
        style={{ maxWidth: 236, margin: "4px auto 0" }}
      >
        <circle cx={cx} cy={cy} r={r} fill="none" style={{ stroke: "rgba(0, 72, 43, 0.06)" }} strokeWidth={sw} />
        {arcs.map(({ s, dash, off }) => (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            style={{ stroke: s.color }}
            strokeWidth={sw}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${cx} ${cy})`}
            onMouseMove={(e) =>
              showTip(
                <>
                  <b>{s.label}</b>
                  <br />
                  {fmtPct(s.value)}
                </>,
                e,
              )
            }
            onMouseLeave={hideTip}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" style={{ fill: "var(--uc-green-dark)" }} fontSize={25} fontWeight={700}>
          {centerValue}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" style={{ fill: "var(--uc-text-secondary)" }} fontSize={11.5}>
          {centerLabel}
        </text>
      </svg>
      <div className="legend">
        {data.map((s) => (
          <span key={s.label} className="lg">
            <span className="sw" style={{ background: s.color }} />
            {s.label} <b>{fmtPct(s.value)}</b>
          </span>
        ))}
      </div>
    </div>
  );
}
