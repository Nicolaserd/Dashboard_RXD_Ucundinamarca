"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FILTRO_PERIODO, FILTRO_SEDE } from "@/components/dashboard/filtros";

export function DatosView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <DashboardShell kpis={data.kpis} filtros={[FILTRO_PERIODO, FILTRO_SEDE]}>
      <div className="grid-2b">
        <div className="card">
          <div className="card-head">
            <h3>Datos históricos por período</h3>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Período</th>
                  <th scope="col" className="num">
                    Total
                  </th>
                  <th scope="col" className="pct">
                    Porcentaje
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.datos.map((row) => (
                  <tr key={row.periodo}>
                    <td>{row.periodo}</td>
                    <td className="num">{row.total.toLocaleString()}</td>
                    <td className="pct pct-green">{row.porcentaje}%</td>
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
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Sede</th>
                  <th scope="col" className="num">
                    Total
                  </th>
                  <th scope="col" className="pct">
                    %
                  </th>
                  <th scope="col" className="center">
                    Tendencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.tablaDetallada.map((row) => (
                  <tr key={row.sede}>
                    <td>{row.sede}</td>
                    <td className="num">{row.total.toLocaleString()}</td>
                    <td className="pct">{row.porcentaje}%</td>
                    <td className="center">
                      <span role="img" aria-label={row.tendencia === "up" ? "Al alza" : "A la baja"}>
                        {row.tendencia === "up" ? "📈" : "📉"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
