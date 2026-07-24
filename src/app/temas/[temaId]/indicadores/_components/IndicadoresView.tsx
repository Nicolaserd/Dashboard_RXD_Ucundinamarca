"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { FilterBar, type FilterConfig } from "@/components/dashboard/FilterBar";

export function IndicadoresView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  const filterConfig: FilterConfig[] = [
    {
      id: "periodo",
      label: "Período",
      options: [
        { value: "2026-I", label: "2026-I" },
        { value: "2025-IV", label: "2025-IV" },
        { value: "2025-III", label: "2025-III" },
      ],
      defaultValue: "2026-I",
    },
    {
      id: "sede",
      label: "Sede",
      options: [
        { value: "bogota-centro", label: "Bogotá Centro" },
        { value: "bogota-sur", label: "Bogotá Sur" },
        { value: "facatativa", label: "Facatativá" },
        { value: "zipaquira", label: "Zipaquirá" },
      ],
    },
  ];

  return (
    <>
      <KPIRow kpis={data.kpis} />
      <FilterBar filters={filterConfig} />
      <div className="grid-2b">
      {data.indicadores.map((ind, idx) => (
        <div key={idx} className="card">
          <div className="card-head">
            <h3>{ind.name}</h3>
          </div>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Valor actual</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#00482b" }}>{ind.valor}</div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Meta</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#2b2b2b" }}>{ind.meta}</div>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
                textAlign: "center",
                background:
                  ind.estado === "ok"
                    ? "rgba(0, 123, 62, 0.1)"
                    : ind.estado === "caution"
                      ? "rgba(154, 90, 2, 0.1)"
                      : "rgba(200, 50, 50, 0.1)",
                color:
                  ind.estado === "ok"
                    ? "#007b3e"
                    : ind.estado === "caution"
                      ? "#9a5a02"
                      : "#c83232",
              }}
            >
              {ind.estado === "ok" ? "✓ En meta" : ind.estado === "caution" ? "⚠ En seguimiento" : "✕ Crítico"}
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
