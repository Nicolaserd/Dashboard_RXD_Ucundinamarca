import type { ReactNode } from "react";

interface ChartCardProps {
  /** Título descriptivo, obligatorio (regla dashboard §1). */
  title: string;
  /** Variable, periodo o unidad — cuando el título solo no baste (§1). */
  sub?: string;
  /** Indica que la gráfica está mostrando una selección activa (§9 «Filtrada»). */
  filtrada?: boolean;
  children: ReactNode;
}

/**
 * Envoltura obligatoria de toda gráfica (regla dashboard §12; CLAUDE.md §5.3).
 * Aporta título, subtítulo e indicador de filtro activo; el contenido
 * (SVG, Recharts, tabla) lo define cada gráfica.
 *
 * @example
 * <ChartCard title="Tendencia temporal" sub="Serie histórica 2024–2026">
 *   <TrendLineChart data={puntos} />
 * </ChartCard>
 */
export function ChartCard({ title, sub, filtrada, children }: ChartCardProps) {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          {sub && <div className="card-sub">{sub}</div>}
        </div>
        {filtrada && <span className="filtered-badge">Filtrada</span>}
      </div>
      {children}
    </div>
  );
}
