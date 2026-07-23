"use client";

import { useDashboard } from "@/features/dashboard/DashboardProvider";
import { fmt } from "@/lib/format";
import { UC } from "./geometry";
import type { CategoriaValor } from "@/types";

/** Barras horizontales de magnitud (un solo tono verde), ordenadas, con valor directo. */
export function HBarChart({ data }: { data: CategoriaValor[] }) {
  const { showTip, hideTip } = useDashboard();
  const W = 680,
    H = 300,
    m = { t: 12, r: 60, b: 12, l: 150 };
  const iw = W - m.l - m.r;
  const rows = data.length;
  const rh = (H - m.t - m.b) / rows;
  const bh = Math.min(26, rh * 0.6);
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Matrícula por facultad">
        {data.map((d, i) => {
          const y = m.t + i * rh + (rh - bh) / 2;
          const bw = (iw * d.value) / max;
          return (
            <g key={d.name}>
              <text x={m.l - 12} y={y + bh / 2 + 4} textAnchor="end" className="cat-label">
                {d.name}
              </text>
              <rect x={m.l} y={y} width={iw} height={bh} rx={5} style={{ fill: UC.track }} />
              <rect
                x={m.l}
                y={y}
                width={Math.max(bw, 3)}
                height={bh}
                rx={5}
                style={{ fill: UC.green }}
                onMouseMove={(e) =>
                  showTip(
                    <>
                      <b>{d.name}</b>
                      <br />
                      {fmt(d.value)} estudiantes
                    </>,
                    e,
                  )
                }
                onMouseLeave={hideTip}
              />
              <text x={m.l + bw + 8} y={y + bh / 2 + 4} className="val-label">
                {fmt(d.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
