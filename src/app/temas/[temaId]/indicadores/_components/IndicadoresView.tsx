"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FILTRO_PERIODO, FILTRO_SEDE } from "@/components/dashboard/filtros";

/** Texto e ícono por estado: nunca se distingue solo por color (regla dashboard §8–9). */
const ESTADO_META = {
  ok: "✓ En meta",
  caution: "⚠ En seguimiento",
  alert: "✕ Crítico",
} as const;

export function IndicadoresView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <DashboardShell kpis={data.kpis} filtros={[FILTRO_PERIODO, FILTRO_SEDE]}>
      <div className="grid-2b">
        {data.indicadores.map((ind) => (
          <div key={ind.name} className="card">
            <div className="card-head">
              <h3>{ind.name}</h3>
            </div>
            <div className="card-body-lg">
              <div className="metric">
                <div className="m-label">Valor actual</div>
                <div className="m-value">{ind.valor}</div>
              </div>
              <div className="metric">
                <div className="m-label">Meta</div>
                <div className="m-value sm">{ind.meta}</div>
              </div>
              <div className={`estado-pill ${ind.estado}`}>{ESTADO_META[ind.estado]}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
