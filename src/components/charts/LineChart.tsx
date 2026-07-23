"use client";

import { useDashboard } from "@/features/dashboard/DashboardProvider";
import { fmt } from "@/lib/format";
import { UC } from "./geometry";
import type { PuntoSerie } from "@/types";

/** Serie temporal: línea + área, con punto final destacado y etiqueta directa. */
export function LineChart({
  data,
  yMin,
  yMax,
  grid,
  unidad = "estudiantes",
}: {
  data: PuntoSerie[];
  yMin: number;
  yMax: number;
  grid: number[];
  unidad?: string;
}) {
  const { showTip, hideTip } = useDashboard();
  const W = 680,
    H = 260,
    m = { t: 20, r: 22, b: 40, l: 54 };
  const iw = W - m.l - m.r,
    ih = H - m.t - m.b;
  const px = (i: number) => m.l + (iw * i) / (data.length - 1);
  const py = (v: number) => m.t + ih * (1 - (v - yMin) / (yMax - yMin));
  const pts = data.map((d, i) => [px(i), py(d.value)] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `M${pts[0][0]} ${m.t + ih} ${pts
    .map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ")} L${pts[pts.length - 1][0]} ${m.t + ih} Z`;

  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Evolución de la matrícula total">
        {grid.map((g) => {
          const y = py(g);
          return (
            <g key={g}>
              <line x1={m.l} y1={y} x2={W - m.r} y2={y} className="gridline" />
              <text x={m.l - 8} y={y + 4} textAnchor="end" className="axis-text">
                {fmt(g)}
              </text>
            </g>
          );
        })}
        <path d={area} style={{ fill: UC.area }} />
        <path d={line} fill="none" style={{ stroke: UC.green }} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const last = i === data.length - 1;
          const [cx, cy] = pts[i];
          return (
            <g key={d.label}>
              <circle
                cx={cx.toFixed(1)}
                cy={cy.toFixed(1)}
                r={last ? 4.5 : 3}
                style={{ fill: last ? UC.greenDark : "#fff", stroke: UC.green }}
                strokeWidth={2}
                onMouseMove={(e) =>
                  showTip(
                    <>
                      <b>{d.label}</b>
                      <br />
                      {fmt(d.value)} {unidad}
                    </>,
                    e,
                  )
                }
                onMouseLeave={hideTip}
              />
              <text x={cx} y={H - m.b + 18} textAnchor="middle" className="cat-label">
                {d.label}
              </text>
              {last && (
                <text x={cx} y={cy - 12} textAnchor="middle" className="val-label">
                  {fmt(d.value)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
