"use client";

import { useMemo, useState } from "react";
import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { construirFiltro } from "@/components/dashboard/filtros";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { DonutChart } from "@/components/charts/DonutChart";

export function ResumenView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);
  const [periodoActivo, setPeriodoActivo] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);

  // Orden cronológico ascendente: dashboardData guarda los períodos del más
  // reciente al más antiguo (ver DatosView, que usa el mismo orden para su tabla).
  // Memoizado: una referencia estable evita que Recharts reinicie la animación
  // de entrada de la gráfica cada vez que cambia la selección del donut.
  const tendencia = useMemo(
    () => [...data.datos].reverse().map((d) => ({ periodo: d.periodo, valor: d.porcentaje })),
    [data.datos],
  );

  // El filtro de período recorta la serie hasta el período elegido (inclusive):
  // filtra realmente la gráfica en lugar de solo resaltar un punto.
  const filtroPeriodo = construirFiltro("periodo", "Período", tendencia.map((t) => t.periodo));
  const idxHasta = periodoActivo ? tendencia.findIndex((t) => t.periodo === periodoActivo) : -1;
  const tendenciaFiltrada = idxHasta >= 0 ? tendencia.slice(0, idxHasta + 1) : tendencia;

  return (
    <DashboardShell
      kpis={data.kpis}
      filtros={[filtroPeriodo]}
      onFilterChange={(id, value) => {
        if (id === "periodo") setPeriodoActivo(value);
      }}
    >
      <div className="grid-2a">
        <ChartCard
          title="Tendencia temporal"
          sub={
            periodoActivo
              ? `Serie histórica · hasta ${periodoActivo}`
              : `Serie histórica · ${tendencia[0]?.periodo} – ${tendencia[tendencia.length - 1]?.periodo}`
          }
          filtrada={!!periodoActivo}
        >
          <TrendLineChart data={tendenciaFiltrada} destacado={periodoActivo} />
        </ChartCard>

        <ChartCard
          title="Distribución por categoría"
          sub="Clic en un segmento para resaltarlo"
          filtrada={!!categoriaSeleccionada}
        >
          <DonutChart
            data={data.categories}
            seleccionado={categoriaSeleccionada}
            onSelect={setCategoriaSeleccionada}
          />
          {categoriaSeleccionada && (
            <div className="filters" style={{ marginTop: 4 }}>
              <div className="filterbar">
                <div className="filter-chip">
                  Categoría: <b>{categoriaSeleccionada}</b>
                </div>
                <button type="button" className="filter-clear" onClick={() => setCategoriaSeleccionada(null)}>
                  Limpiar selección
                </button>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid-2b">
        <div className="card">
          <div className="card-head">
            <h3>Últimas actualizaciones</h3>
          </div>
          <div className="card-body">
            {data.updates.map((upd) => (
              <div key={upd.title} className="list-item">
                <div className="li-title">{upd.title}</div>
                <div className="li-meta">{upd.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Variación vs. periodo anterior</h3>
          </div>
          <div className="card-body">
            {data.variations.map((variacion) => (
              <div key={variacion.label} className="list-item">
                <div className="li-title">{variacion.label}</div>
                <div className={`li-value ${variacion.type}`}>
                  {variacion.type === "up" ? "↑" : "↓"} {variacion.value}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
