"use client";

import { DashboardProvider, useDashboard } from "@/features/dashboard/DashboardProvider";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { HBarChart } from "@/components/charts/HBarChart";
import { KpiCard } from "@/components/charts/KpiCard";
import { EmptyState } from "@/components/charts/EmptyState";
import { FACULTAD, KPIS, MODALIDAD, NIVEL, PERIODOS, SEDES } from "../_data";

/**
 * Composición de la vista Resumen — COLOCADA con la vista (regla scaffolding).
 * Reúne componentes GENERALES (`components/charts`) y el estado compartido del
 * dashboard. La barra de filtro refleja la selección activa (regla dashboard §3–4).
 */
function FiltroActivo() {
  const { selected, clear } = useDashboard();
  if (!selected) {
    return (
      <span className="filter-hint">
        Haga clic en una barra de <b>“Estudiantes por sede”</b> para filtrar el tablero.
      </span>
    );
  }
  return (
    <div className="filter-chip">
      <span>Filtro activo: Sede {selected}</span>
      <button className="fc-x" type="button" onClick={clear} aria-label="Limpiar filtro">
        ✕
      </button>
    </div>
  );
}

export function ResumenDashboard() {
  return (
    <DashboardProvider>
      <div className="canvas">
        <div className="filterbar">
          <FiltroActivo />
        </div>

        <div className="kpi-row">
          {KPIS.map((k) => (
            <KpiCard key={k.label} kpi={k} />
          ))}
        </div>

        <div className="grid-2a">
          <ChartCard title="Estudiantes matriculados por sede" sub="Periodo 2026-I · haga clic para filtrar">
            <BarChart data={SEDES} yMax={9000} grid={[0, 3000, 6000, 9000]} ariaLabel="Estudiantes matriculados por sede" />
          </ChartCard>
          <ChartCard title="Distribución por nivel académico" sub="Participación sobre el total" respondsToFilter>
            <DonutChart data={NIVEL} centerValue="26.550" centerLabel="matriculados" />
          </ChartCard>
        </div>

        <div className="grid-2b">
          <ChartCard title="Evolución de la matrícula total" sub="Últimos 7 periodos académicos" respondsToFilter>
            <LineChart data={PERIODOS} yMin={22000} yMax={28000} grid={[22000, 24000, 26000, 28000]} />
          </ChartCard>
          <ChartCard title="Matrícula por facultad" sub="Periodo 2026-I · seis primeras" respondsToFilter>
            <HBarChart data={FACULTAD} />
          </ChartCard>
        </div>

        <div className="grid-2b">
          <ChartCard title="Nuevos admitidos por modalidad" sub="Presencial · Distancia · Virtual">
            <BarChart
              data={MODALIDAD}
              yMax={3200}
              grid={[0, 1000, 2000, 3000]}
              ariaLabel="Nuevos admitidos por modalidad"
              unidad="admitidos"
              interactive={false}
            />
          </ChartCard>
          <ChartCard title="Convenios internacionales activos" sub="Movilidad estudiantil">
            <EmptyState
              title="No existen datos para los filtros seleccionados"
              message="No se encontraron convenios que coincidan con el periodo y la sede seleccionados."
              action="Ajustar filtros"
            />
          </ChartCard>
        </div>
      </div>
    </DashboardProvider>
  );
}
