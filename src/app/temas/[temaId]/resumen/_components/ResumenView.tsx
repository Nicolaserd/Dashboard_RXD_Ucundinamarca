"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FILTRO_PERIODO } from "@/components/dashboard/filtros";

export function ResumenView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <DashboardShell kpis={data.kpis} filtros={[FILTRO_PERIODO]}>
      <div className="grid-2a">
        <div className="card">
          <div className="card-head">
            <h3>Tendencia temporal</h3>
          </div>
          <svg className="chart" viewBox="0 0 600 300" role="img" aria-label="Tendencia temporal del periodo">
            <line x1="40" y1="250" x2="580" y2="250" className="baseline" />
            <line x1="40" y1="50" x2="40" y2="250" className="baseline" />
            <polyline
              points="40,200 120,180 200,150 280,170 360,130 440,100 520,120"
              stroke="var(--uc-green)"
              fill="none"
              strokeWidth="2"
            />
            <text x="40" y="280" className="axis-text">
              {data.chart.xLabels[0]}
            </text>
            <text x="520" y="280" className="axis-text">
              {data.chart.xLabels[1]}
            </text>
          </svg>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Distribución por categoría</h3>
          </div>
          <div className="card-body">
            {data.categories.map((cat) => (
              <div key={cat.name} className="bar-row">
                <div className="bar-row-head">
                  <span>{cat.name}</span>
                  <b>{cat.value}%</b>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2b">
        <div className="card">
          <div className="card-head">
            <h3>Últimas actualizaciones</h3>
          </div>
          <div className="card-body">
            {data.updates.map((upd) => (
              <div key={upd.title} className="list-item">
                <div className="li-title">{upd.title}</div>
                <div className="li-meta">{upd.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Variación vs. periodo anterior</h3>
          </div>
          <div className="card-body">
            {data.variations.map((variacion) => (
              <div key={variacion.label} className="list-item">
                <div className="li-title">{variacion.label}</div>
                <div className={`li-value ${variacion.type}`}>
                  {variacion.type === "up" ? "↑" : "↓"} {variacion.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
