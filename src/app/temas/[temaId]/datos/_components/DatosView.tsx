"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { FilterBar, type FilterConfig } from "@/components/dashboard/FilterBar";

export function DatosView({ temaId }: { temaId: string }) {
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
      <div className="card">
        <div className="card-head">
          <h3>Datos históricos por período</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #d9ddd9", background: "#f7f7f5" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Período</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Total</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {data.datos.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #d9ddd9" }}>
                  <td style={{ padding: "12px 16px", color: "#2b2b2b", fontSize: "14px" }}>{row.periodo}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#2b2b2b", fontSize: "14px", fontWeight: 500 }}>
                    {row.total.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#007b3e", fontSize: "14px", fontWeight: 600 }}>
                    {row.porcentaje}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3>Datos por sede (actual)</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #d9ddd9", background: "#f7f7f5" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Sede</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Total</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>%</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.tablaDetallada.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #d9ddd9" }}>
                  <td style={{ padding: "12px 16px", color: "#2b2b2b", fontSize: "14px" }}>{row.sede}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#2b2b2b", fontSize: "14px", fontWeight: 500 }}>
                    {row.total.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", color: "#2b2b2b", fontSize: "14px", fontWeight: 600 }}>
                    {row.porcentaje}%
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "16px" }}>
                    {row.tendencia === "up" ? "📈" : "📉"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}
