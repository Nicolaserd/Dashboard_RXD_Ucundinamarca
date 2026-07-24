"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { FilterBar, type FilterConfig } from "@/components/dashboard/FilterBar";

export function ReportesView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  const filterConfig: FilterConfig[] = [
    {
      id: "tipo",
      label: "Tipo",
      options: [
        { value: "analisis", label: "Análisis" },
        { value: "datos", label: "Datos" },
        { value: "ejecutivo", label: "Ejecutivo" },
      ],
    },
  ];

  return (
    <>
      <KPIRow kpis={data.kpis} />
      <FilterBar filters={filterConfig} />
      <div className="grid-2b">
      {data.reportes.map((rep, idx) => (
        <div key={idx} className="card">
          <div className="card-head">
            <div>
              <h3 style={{ marginBottom: "8px" }}>{rep.titulo}</h3>
              <div style={{ fontSize: "12px", color: "#999" }}>
                <span style={{ background: "#f0f0f0", padding: "2px 8px", borderRadius: "4px", display: "inline-block" }}>
                  {rep.tipo}
                </span>
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Fecha de generación</div>
              <div style={{ fontSize: "14px", fontWeight: 500, color: "#2b2b2b" }}>{rep.fecha}</div>
            </div>
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#007b3e",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ⬇️ Descargar {rep.descarga}
            </button>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
