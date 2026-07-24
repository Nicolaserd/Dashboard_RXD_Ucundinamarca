"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { FilterConfig } from "@/components/dashboard/FilterBar";

/** Filtro propio de esta vista: no se comparte, por eso vive aquí. */
const FILTRO_TIPO: FilterConfig = {
  id: "tipo",
  label: "Tipo",
  options: [
    { value: "analisis", label: "Análisis" },
    { value: "datos", label: "Datos" },
    { value: "ejecutivo", label: "Ejecutivo" },
  ],
};

export function ReportesView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <DashboardShell kpis={data.kpis} filtros={[FILTRO_TIPO]}>
      <div className="grid-2b">
        {data.reportes.map((rep) => (
          <div key={rep.titulo} className="card">
            <div className="card-head">
              <div>
                <h3>{rep.titulo}</h3>
                <div className="card-head-tags">
                  <span className="rep-tipo">{rep.tipo}</span>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="metric">
                <div className="m-label">Fecha de generación</div>
                <div className="m-value sm">{rep.fecha}</div>
              </div>
              <button type="button" className="btn-descarga">
                ⬇️ Descargar {rep.descarga}
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
