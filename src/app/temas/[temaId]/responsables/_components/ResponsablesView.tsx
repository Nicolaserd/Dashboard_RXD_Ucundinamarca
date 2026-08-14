"use client";

import { useMemo } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarrasCategoria } from "@/components/charts/BarrasCategoria";
import { EstadoVacio } from "@/components/dashboard/EstadoVacio";
import { useTableroOM } from "@/features/dashboard/useTableroOM";
import { construirKPIs } from "@/features/dashboard/kpis";
import { avancePorArea } from "@/lib/om/metricas";

/** Áreas mostradas en la gráfica; el resto queda disponible en la tabla. */
const MAX_AREAS_GRAFICA = 12;

/**
 * Desempeño del seguimiento por área institucional responsable.
 *
 * El campo «Responsable» de los libros es texto libre —95 variantes distintas—,
 * así que el ETL etiqueta cada OM con las áreas canónicas que menciona. Una OM
 * compartida cuenta en todas sus áreas: la tabla mide carga por área, no una
 * partición del total, y la vista lo declara.
 */
export function ResponsablesView({ temaId }: { temaId: string }) {
  const { todas, oms, omsIgnorando, filtros, activos, controles, fijar, alternar, limpiar } =
    useTableroOM(temaId);

  const kpis = useMemo(() => construirKPIs(oms, todas), [oms, todas]);

  // La gráfica filtra por área: se calcula ignorando ese filtro para conservar
  // el contexto sobre el que se hizo la selección.
  const areas = useMemo(() => avancePorArea(omsIgnorando("area")), [omsIgnorando]);
  // Referencia estable: si el array se recreara en cada render, Recharts
  // reiniciaría la animación de entrada con cada clic de selección.
  const areasGrafica = useMemo(
    () =>
      areas.slice(0, MAX_AREAS_GRAFICA).map((area) => ({
        clave: area.clave,
        etiqueta: area.clave,
        valor: area.avance,
        detalle: `${area.cumplidas} de ${area.total} cumplidas`,
      })),
    [areas],
  );

  // Redacciones literales del campo «Responsable» de las OM seleccionadas:
  // conserva la trazabilidad hacia el libro de origen.
  const responsablesLiterales = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const om of oms) {
      const texto = om.responsable || "Sin registrar";
      conteo.set(texto, (conteo.get(texto) ?? 0) + 1);
    }
    return [...conteo.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
  }, [oms]);

  return (
    <DashboardShell
      kpis={kpis}
      filtros={controles}
      valores={filtros}
      onFilterChange={(campo, valor) => fijar(campo as never, valor)}
      onClearAll={limpiar}
    >
      <ChartCard
        title={`Avance promedio por área responsable — ${MAX_AREAS_GRAFICA} áreas con mayor carga`}
        sub="Se eligen las de más OM y se ordenan de mayor a menor avance · clic en una barra para filtrar"
        estado={areasGrafica.length === 0 ? "vacio" : "ok"}
        filtrada={Boolean(filtros.area)}
        ancha
      >
        <BarrasCategoria
          data={areasGrafica}
          orientacion="horizontal"
          seleccionado={filtros.area || null}
          onSelect={(clave) => alternar("area", clave)}
          ejeValor="Eje horizontal: avance promedio (%). Eje vertical: área institucional responsable."
        />
      </ChartCard>

      <div className="grid-2a">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Carga y avance por área</h3>
              <div className="card-sub">
                Una OM con varias áreas cuenta en todas; la suma supera el total de OM
              </div>
            </div>
            {activos && <span className="filtered-badge">Filtrada</span>}
          </div>

          {areas.length === 0 ? (
            <EstadoVacio />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">
                  Áreas responsables con su número de OM, cumplidas, pendientes y avance promedio
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Área responsable</th>
                    <th scope="col" className="num">
                      OM
                    </th>
                    <th scope="col" className="num">
                      Cumplidas
                    </th>
                    <th scope="col" className="num">
                      Sin cerrar
                    </th>
                    <th scope="col" className="pct">
                      Avance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => {
                    const activa = filtros.area === area.clave;
                    return (
                      <tr key={area.clave} className={activa ? "fila-activa" : undefined}>
                        <th scope="row" className="celda-nombre">
                          <button
                            type="button"
                            className="celda-filtro"
                            aria-pressed={activa}
                            onClick={() => alternar("area", area.clave)}
                          >
                            {activa && <span aria-hidden="true">✓ </span>}
                            {area.clave}
                          </button>
                        </th>
                        <td className="num">{area.total}</td>
                        <td className="num">{area.cumplidas}</td>
                        <td className="num">{area.sinCerrar}</td>
                        <td className="pct pct-green">{area.avance}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Responsables tal como se registraron</h3>
              <div className="card-sub">
                Redacción original para las {oms.length} oportunidades de mejora seleccionadas
              </div>
            </div>
          </div>

          {responsablesLiterales.length === 0 ? (
            <EstadoVacio />
          ) : (
            <ul className="om-lista om-lista-compacta">
              {responsablesLiterales.map(([texto, cantidad]) => (
                <li key={texto} className="om-item">
                  <div className="om-item-head">
                    <span className="om-ref">
                      {cantidad} {cantidad === 1 ? "OM" : "OM"}
                    </span>
                  </div>
                  <p className="om-meta">{texto}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
