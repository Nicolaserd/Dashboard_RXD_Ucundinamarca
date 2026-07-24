"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { KPIRow } from "@/components/dashboard/KPIRow";
import { FilterBar, type FilterConfig } from "@/components/dashboard/FilterBar";

export function ResumenView({ temaId }: { temaId: string }) {
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
  ];

  return (
    <>
      <KPIRow kpis={data.kpis} />
      <FilterBar filters={filterConfig} />

      {/* Gráficas principales */}
      <div className="grid-2a">
        <div className="card">
          <div className="card-head">
            <h3>Tendencia temporal</h3>
          </div>
          <svg className="chart" viewBox="0 0 600 300">
            <line x1="40" y1="250" x2="580" y2="250" stroke="#d9ddd9" strokeWidth="1" />
            <line x1="40" y1="50" x2="40" y2="250" stroke="#d9ddd9" strokeWidth="1" />
            <polyline
              points="40,200 120,180 200,150 280,170 360,130 440,100 520,120"
              stroke="#007b3e"
              fill="none"
              strokeWidth="2"
            />
            <text x="40" y="280" fontSize="12" fill="#666">
              {data.chart.xLabels[0]}
            </text>
            <text x="520" y="280" fontSize="12" fill="#666">
              {data.chart.xLabels[1]}
            </text>
          </svg>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Distribución por categoría</h3>
          </div>
          <div style={{ padding: "16px" }}>
            {data.categories.map((cat, idx) => (
              <div key={idx} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: 600 }}>{cat.value}%</span>
                </div>
                <div style={{ background: "#f7f7f5", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "#007b3e",
                      height: "100%",
                      width: `${cat.value}%`,
                    }}
                  />
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
          <div style={{ padding: "16px", fontSize: "13px", lineHeight: "1.8" }}>
            {data.updates.map((upd, idx) => (
              <div key={idx} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #d9ddd9" }}>
                <div style={{ fontWeight: 600, color: "#2b2b2b" }}>{upd.title}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>{upd.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Variación vs. periodo anterior</h3>
          </div>
          <div style={{ padding: "16px" }}>
            {data.variations.map((var_, idx) => (
              <div key={idx} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #d9ddd9" }}>
                <div style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "4px" }}>{var_.label}</div>
                <div style={{ fontSize: "20px", fontWeight: 700, color: var_.type === "up" ? "#007b3e" : "#9a5a02" }}>
                  {var_.type === "up" ? "↑" : "↓"} {var_.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
