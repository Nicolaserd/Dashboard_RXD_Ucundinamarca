"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";

export function SeguimientoView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <div className="card">
      <div className="card-head">
        <h3>Plan de seguimiento 2026-I</h3>
      </div>
      <div style={{ padding: "20px" }}>
        {data.seguimiento.map((item, idx) => (
          <div key={idx} style={{ marginBottom: idx < data.seguimiento.length - 1 ? "24px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background:
                    item.estado === "completado"
                      ? "#007b3e"
                      : item.estado === "en-progreso"
                        ? "#f7931e"
                        : "#e0e0e0",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  marginRight: "12px",
                  fontWeight: 600,
                  fontSize: "16px",
                  flexShrink: 0,
                }}
              >
                {item.estado === "completado" ? "✓" : item.estado === "en-progreso" ? "◐" : "◯"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "2px" }}>{item.fase}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>{item.fecha}</div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  background:
                    item.estado === "completado"
                      ? "rgba(0, 123, 62, 0.1)"
                      : item.estado === "en-progreso"
                        ? "rgba(247, 147, 30, 0.1)"
                        : "rgba(200, 200, 200, 0.1)",
                  color:
                    item.estado === "completado"
                      ? "#007b3e"
                      : item.estado === "en-progreso"
                        ? "#f7931e"
                        : "#999",
                }}
              >
                {item.estado === "completado" ? "Completado" : item.estado === "en-progreso" ? "En progreso" : "Pendiente"}
              </div>
            </div>
            {item.progreso !== undefined && (
              <div style={{ marginLeft: "44px", marginTop: "8px" }}>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "4px" }}>{item.progreso}% completado</div>
                <div style={{ background: "#f0f0f0", height: "6px", borderRadius: "3px", overflow: "hidden" }}>
                  <div
                    style={{
                      background: "#f7931e",
                      height: "100%",
                      width: `${item.progreso}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
