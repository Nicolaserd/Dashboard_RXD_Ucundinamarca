"use client";

import { useState } from "react";
import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { EstadoVacio } from "@/components/dashboard/EstadoVacio";
import type { FilterConfig } from "@/components/dashboard/FilterBar";

/**
 * Filtro por estado del indicador: filtra sobre el campo real `estado` de los
 * datos (los indicadores no tienen dimensión de período ni sede).
 */
const FILTRO_ESTADO: FilterConfig = {
  id: "estado",
  label: "Estado",
  options: [
    { value: "ok", label: "En meta" },
    { value: "caution", label: "En seguimiento" },
    { value: "alert", label: "Crítico" },
  ],
};

/** Texto e ícono por estado: nunca se distingue solo por color (regla dashboard §8–9). */
const ESTADO_META = {
  ok: "✓ En meta",
  caution: "⚠ En seguimiento",
  alert: "✕ Crítico",
} as const;

export function IndicadoresView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);
  const [estadoSel, setEstadoSel] = useState("");

  const indicadores = estadoSel
    ? data.indicadores.filter((ind) => ind.estado === estadoSel)
    : data.indicadores;

  return (
    <DashboardShell
      kpis={data.kpis}
      filtros={[FILTRO_ESTADO]}
      onFilterChange={(id, value) => {
        if (id === "estado") setEstadoSel(value);
      }}
    >
      {indicadores.length === 0 ? (
        <EstadoVacio mensaje="No hay indicadores con el estado seleccionado." />
      ) : (
        <div className="grid-2b">
          {indicadores.map((ind) => (
            <div key={ind.name} className="card">
              <div className="card-head">
                <h3>{ind.name}</h3>
              </div>
              <div className="card-body-lg">
                <div className="metric">
                  <div className="m-label">Valor actual</div>
                  <div className="m-value">{ind.valor}</div>
                </div>
                <div className="metric">
                  <div className="m-label">Meta</div>
                  <div className="m-value sm">{ind.meta}</div>
                </div>
                <div className={`estado-pill ${ind.estado}`}>{ESTADO_META[ind.estado]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
