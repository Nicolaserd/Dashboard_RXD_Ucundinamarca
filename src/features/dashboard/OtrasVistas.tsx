"use client";

import { getDashboardData } from "./dashboardData";

export function ReportesView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
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
  );
}

export function DatosView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
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
  );
}

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
