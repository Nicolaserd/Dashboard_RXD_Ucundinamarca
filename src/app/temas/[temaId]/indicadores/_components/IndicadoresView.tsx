"use client";

import { useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { EstadoVacio } from "@/components/dashboard/EstadoVacio";
import { useTableroOM } from "@/features/dashboard/useTableroOM";
import { construirKPIs } from "@/features/dashboard/kpis";
import { formatearFecha } from "@/lib/om/avance";
import { serieAvancePorCorte } from "@/lib/om/metricas";
import { construirIndicadores, type EstadoIndicador } from "../_lib/indicadores";

/** Refuerzo no cromático del estado del indicador (regla dashboard §8–9, §11). */
const SIMBOLO: Record<EstadoIndicador, string> = { ok: "✓", caution: "!", alert: "✕" };
const LECTURA: Record<EstadoIndicador, string> = {
  ok: "En referencia",
  caution: "Atención",
  alert: "Fuera de referencia",
};

/**
 * Indicadores de gestión del seguimiento a OM, contrastados con umbrales de
 * lectura, más la evolución de la tasa de cierre (regla dashboard §5, §9–11).
 */
export function IndicadoresView({ temaId }: { temaId: string }) {
  const { todas, oms, filtros, activos, controles, fijar, limpiar } = useTableroOM(temaId);

  const kpis = useMemo(() => construirKPIs(oms, todas), [oms, todas]);
  const indicadores = useMemo(() => construirIndicadores(oms), [oms]);

  const serieCierre = useMemo(
    () =>
      serieAvancePorCorte(oms).map((punto) => ({
        etiqueta: formatearFecha(punto.corte),
        valor: punto.tasaCierre,
        base: punto.base,
      })),
    [oms],
  );

  return (
    <DashboardShell
      kpis={kpis}
      filtros={controles}
      valores={filtros}
      onFilterChange={(campo, valor) => fijar(campo as never, valor)}
      onClearAll={limpiar}
    >
      <ChartCard
        title="Evolución de la tasa de cierre"
        sub="Porcentaje de oportunidades cumplidas (calificación 2) sobre las ya calificadas en cada corte"
        estado={serieCierre.length === 0 ? "vacio" : "ok"}
        filtrada={activos}
        mensajeVacio="No existen cortes de seguimiento para los filtros seleccionados."
      >
        <TrendLineChart
          data={serieCierre}
          serie="Tasa de cierre"
          ejeY="OM cumplidas (%)"
          baseLabel="OM calificadas"
          meta={{ valor: 80, label: "Referencia 80 %" }}
        />
      </ChartCard>

      <div className="card">
        <div className="card-head">
          <div>
            <h3>Indicadores de gestión del seguimiento</h3>
            <div className="card-sub">
              Calculados sobre las {oms.length} oportunidades de mejora seleccionadas · escala institucional 0–2
            </div>
          </div>
          {activos && <span className="filtered-badge">Filtrada</span>}
        </div>

        {oms.length === 0 ? (
          <EstadoVacio />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <caption className="sr-only">
                Indicadores de gestión con su valor, referencia de lectura y base de cálculo
              </caption>
              <thead>
                <tr>
                  <th scope="col">Indicador</th>
                  <th scope="col" className="num">
                    Valor
                  </th>
                  <th scope="col" className="num">
                    Referencia
                  </th>
                  <th scope="col">Lectura</th>
                  <th scope="col">Base de cálculo</th>
                </tr>
              </thead>
              <tbody>
                {indicadores.map((indicador) => (
                  <tr key={indicador.id}>
                    <th scope="row" className="celda-nombre">
                      {indicador.nombre}
                    </th>
                    <td className="num destacado">{indicador.valor}</td>
                    <td className="num">{indicador.referencia}</td>
                    <td>
                      <span className={`estado-pill ${indicador.estado}`}>
                        <span aria-hidden="true">{SIMBOLO[indicador.estado]}</span>{" "}
                        {LECTURA[indicador.estado]}
                      </span>
                    </td>
                    <td className="celda-base">{indicador.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="nota-pie">
          Las referencias son umbrales de lectura definidos para este tablero con el fin de priorizar
          la atención; no sustituyen las metas institucionales aprobadas para cada sistema de gestión.
        </p>
      </div>
    </DashboardShell>
  );
}
