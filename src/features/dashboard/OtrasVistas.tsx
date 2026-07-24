"use client";

import { getDashboardData } from "./dashboardData";

export function ReportesView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <div className="card">
      <div className="card-head">
        <h3>Reportes disponibles</h3>
      </div>
      <div style={{ padding: "0" }}>
        {data.reportes.map((rep, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: idx < data.reportes.length - 1 ? "1px solid #d9ddd9" : "none",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "#2b2b2b", marginBottom: "4px" }}>{rep.titulo}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>{rep.fecha}</div>
            </div>
            <button
              style={{
                padding: "8px 16px",
                background: "#007b3e",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {rep.descarga}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DatosView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <div className="card">
      <div className="card-head">
        <h3>Datos históricos</h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #d9ddd9" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>
                Periodo
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>
                Total
              </th>
              <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#2b2b2b", fontSize: "13px" }}>
                %
              </th>
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
  );
}

export function SeguimientoView({ temaId }: { temaId: string }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Plan de seguimiento 2026-I</h3>
      </div>
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#007b3e",
                color: "white",
                display: "grid",
                placeItems: "center",
                marginRight: "12px",
                fontWeight: 600,
              }}
            >
              ✓
            </div>
            <div style={{ fontWeight: 600, color: "#2b2b2b" }}>Recopilación de datos inicial</div>
          </div>
          <div style={{ fontSize: "13px", color: "#666", marginLeft: "36px" }}>Completado el 10 de julio</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#f7931e",
                color: "white",
                display: "grid",
                placeItems: "center",
                marginRight: "12px",
                fontWeight: 600,
              }}
            >
              ◐
            </div>
            <div style={{ fontWeight: 600, color: "#2b2b2b" }}>Análisis y procesamiento</div>
          </div>
          <div style={{ fontSize: "13px", color: "#666", marginLeft: "36px" }}>En progreso - 65% completado</div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "2px solid #d9ddd9",
                display: "grid",
                placeItems: "center",
                marginRight: "12px",
              }}
            >
              ◯
            </div>
            <div style={{ fontWeight: 600, color: "#666" }}>Generación de reportes</div>
          </div>
          <div style={{ fontSize: "13px", color: "#666", marginLeft: "36px" }}>Próximo: 28 de julio</div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "2px solid #d9ddd9",
                display: "grid",
                placeItems: "center",
                marginRight: "12px",
              }}
            >
              ◯
            </div>
            <div style={{ fontWeight: 600, color: "#666" }}>Retroalimentación y ajustes</div>
          </div>
          <div style={{ fontSize: "13px", color: "#666", marginLeft: "36px" }}>Previsto: 5 de agosto</div>
        </div>
      </div>
    </div>
  );
}
