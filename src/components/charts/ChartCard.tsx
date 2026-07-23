"use client";

import type { ReactNode } from "react";
import { useDashboard } from "@/features/dashboard/DashboardProvider";

/**
 * Contenedor reutilizable de gráfica (regla dashboard §10): título descriptivo,
 * subtítulo y estado "Filtrada" cuando hay un filtro activo en la vista.
 * `respondsToFilter` = la gráfica reacciona al filtro fijado por otra (§3, §7).
 */
export function ChartCard({
  title,
  sub,
  respondsToFilter = false,
  children,
}: {
  title: string;
  sub?: string;
  respondsToFilter?: boolean;
  children: ReactNode;
}) {
  const { selected } = useDashboard();
  const filtered = respondsToFilter && selected != null;

  return (
    <div className={`card${filtered ? " dimmed" : ""}`}>
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {sub && <div className="sub">{sub}</div>}
        </div>
        {filtered && <span className="filtered-badge">Filtrada · {selected}</span>}
      </div>
      {children}
    </div>
  );
}
