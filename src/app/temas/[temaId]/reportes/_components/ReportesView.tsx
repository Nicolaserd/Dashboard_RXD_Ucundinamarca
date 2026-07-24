"use client";

import { useState } from "react";
import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EstadoVacio } from "@/components/dashboard/EstadoVacio";
import { construirFiltro } from "@/components/dashboard/filtros";

export function ReportesView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);
  const [tipoSel, setTipoSel] = useState("");

  const filtroTipo = construirFiltro("tipo", "Tipo", data.reportes.map((r) => r.tipo));
  const reportes = tipoSel ? data.reportes.filter((r) => r.tipo === tipoSel) : data.reportes;

  return (
    <DashboardShell
      kpis={data.kpis}
      filtros={[filtroTipo]}
      onFilterChange={(id, value) => {
        if (id === "tipo") setTipoSel(value);
      }}
    >
      {reportes.length === 0 ? (
        <EstadoVacio />
      ) : (
        <div className="grid-2b">
          {reportes.map((rep) => (
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
      )}
    </DashboardShell>
  );
}
