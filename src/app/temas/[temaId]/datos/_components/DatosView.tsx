"use client";

import { useState } from "react";
import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EstadoVacio } from "@/components/dashboard/EstadoVacio";
import { construirFiltro } from "@/components/dashboard/filtros";

export function DatosView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);
  const [periodoSel, setPeriodoSel] = useState("");
  const [sedeSel, setSedeSel] = useState("");

  // Opciones derivadas de los datos reales: siempre coinciden con lo filtrable.
  const filtroPeriodo = construirFiltro("periodo", "Período", data.datos.map((d) => d.periodo));
  const filtroSede = construirFiltro("sede", "Sede", data.tablaDetallada.map((t) => t.sede));

  const historico = periodoSel ? data.datos.filter((d) => d.periodo === periodoSel) : data.datos;
  const porSede = sedeSel ? data.tablaDetallada.filter((t) => t.sede === sedeSel) : data.tablaDetallada;

  return (
    <DashboardShell
      kpis={data.kpis}
      filtros={[filtroPeriodo, filtroSede]}
      onFilterChange={(id, value) => {
        if (id === "periodo") setPeriodoSel(value);
        if (id === "sede") setSedeSel(value);
      }}
    >
      <div className="grid-2b">
        <div className="card">
          <div className="card-head">
            <h3>Datos históricos por período</h3>
          </div>
          {historico.length === 0 ? (
            <EstadoVacio />
          ) : (
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
                  {historico.map((row) => (
                    <tr key={row.periodo}>
                      <td>{row.periodo}</td>
                      <td className="num">{row.total.toLocaleString()}</td>
                      <td className="pct pct-green">{row.porcentaje}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Datos por sede (actual)</h3>
          </div>
          {porSede.length === 0 ? (
            <EstadoVacio />
          ) : (
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
                  {porSede.map((row) => (
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
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
