"use client";

import { getDashboardData } from "@/features/dashboard/dashboardData";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { FilterConfig } from "@/components/dashboard/FilterBar";

/** Filtro propio de esta vista: no se comparte, por eso vive aquí. */
const FILTRO_ESTADO: FilterConfig = {
  id: "estado",
  label: "Estado",
  options: [
    { value: "completado", label: "Completado" },
    { value: "en-progreso", label: "En progreso" },
    { value: "pendiente", label: "Pendiente" },
  ],
};

/** Ícono y texto por estado: nunca se distingue solo por color (regla dashboard §8–9). */
const ESTADO_META = {
  completado: { icono: "✓", texto: "Completado" },
  "en-progreso": { icono: "◐", texto: "En progreso" },
  pendiente: { icono: "◯", texto: "Pendiente" },
} as const;

export function SeguimientoView({ temaId }: { temaId: string }) {
  const data = getDashboardData(temaId);

  return (
    <DashboardShell kpis={data.kpis} filtros={[FILTRO_ESTADO]}>
      <div className="card">
        <div className="card-head">
          <h3>Plan de seguimiento 2026-I</h3>
        </div>
        <div className="card-body-lg">
          {data.seguimiento.map((item) => {
            const meta = ESTADO_META[item.estado];
            return (
              <div key={item.fase} className="hito">
                <div className="hito-head">
                  <div className={`hito-ic ${item.estado}`} aria-hidden="true">
                    {meta.icono}
                  </div>
                  <div className="hito-txt">
                    <div className="h-fase">{item.fase}</div>
                    <div className="h-fecha">{item.fecha}</div>
                  </div>
                  <div className={`hito-tag ${item.estado}`}>{meta.texto}</div>
                </div>
                {item.progreso !== undefined && (
                  <div className="hito-prog">
                    <div className="p-label">{item.progreso}% completado</div>
                    <div className="p-track">
                      <div className="p-fill" style={{ width: `${item.progreso}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
