"use client";

import { useDashboard } from "@/features/dashboard/DashboardProvider";
import { fmt } from "@/lib/format";
import { topRoundRect, UC } from "./geometry";
import type { CategoriaValor } from "@/types";

/**
 * Barras verticales. Reutilizable en dos modos (LSP):
 * - `interactive` (por defecto): interacción-como-filtro (regla dashboard §3);
 *   al hacer clic se fija el filtro de la vista y la barra se resalta con
 *   color + etiqueta (no solo color, §8–9).
 * - no interactivo: solo lectura con tooltip (p. ej. una gráfica de apoyo).
 */
export function BarChart({
  data,
  yMax,
  grid,
  ariaLabel,
  unidad = "estudiantes",
  interactive = true,
}: {
  data: CategoriaValor[];
  yMax: number;
  grid: number[];
  ariaLabel: string;
  unidad?: string;
  interactive?: boolean;
}) {
  const { selected, toggle, showTip, hideTip } = useDashboard();
  const W = 680,
    H = 300,
    m = { t: 22, r: 14, b: 52, l: 52 };
  const iw = W - m.l - m.r,
    ih = H - m.t - m.b;
  const slot = iw / data.length,
    bw = Math.min(46, slot * 0.56);

  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {grid.map((g) => {
          const y = m.t + ih * (1 - g / yMax);
          return (
            <g key={g}>
              <line x1={m.l} y1={y} x2={W - m.r} y2={y} className={g === 0 ? "baseline" : "gridline"} />
              <text x={m.l - 8} y={y + 4} textAnchor="end" className="axis-text">
                {fmt(g)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = m.l + i * slot + (slot - bw) / 2;
          const bh = ih * (d.value / yMax);
          const y = m.t + ih - bh;
          const isSel = interactive && selected === d.name;
          const dim = interactive && selected != null && !isSel;
          const tip = (e: { clientX: number; clientY: number }) =>
            showTip(
              <>
                <b>{d.name}</b>
                <br />
                {fmt(d.value)} {unidad}
              </>,
              e,
            );
          return (
            <g key={d.name} opacity={dim ? 0.34 : 1}>
              <path
                d={topRoundRect(x, y, bw, bh, 5)}
                className="bar"
                style={{ fill: isSel ? UC.gold : UC.green, cursor: interactive ? "pointer" : "default" }}
                tabIndex={interactive ? 0 : undefined}
                role={interactive ? "button" : undefined}
                aria-pressed={interactive ? isSel : undefined}
                aria-label={interactive ? `${d.name}: ${fmt(d.value)} ${unidad}` : undefined}
                onClick={interactive ? () => toggle(d.name) : undefined}
                onKeyDown={
                  interactive
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(d.name);
                        }
                      }
                    : undefined
                }
                onMouseMove={tip}
                onMouseLeave={hideTip}
              />
              <text x={x + bw / 2} y={y - 7} textAnchor="middle" className={`val-label${isSel ? " sel" : ""}`}>
                {fmt(d.value)}
              </text>
              <text x={x + bw / 2} y={H - m.b + 18} textAnchor="middle" className="cat-label">
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
