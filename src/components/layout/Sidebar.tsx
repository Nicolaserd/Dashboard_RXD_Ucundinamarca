import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";

/**
 * Menú lateral fijo, siempre visible, NO colapsable (regla layouts §8).
 * Reutilizable para todos los temas; el estado activo se señala con más de un
 * recurso (fondo + barra indicadora + peso tipográfico), no solo color (§8.3).
 */
export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <LogoUcundinamarca variant="horizontal" tono="blanco" height={80} />
      </div>

      <div className="nav-label">Vistas</div>
      <span className="nav-item active" aria-current="page">
        <Icon name="grid" />
        Resumen
      </span>
      <span className="nav-item muted">
        <Icon name="bars" />
        Indicadores
      </span>
      <span className="nav-item muted">
        <Icon name="report" />
        Reportes
      </span>
      <span className="nav-item muted">
        <Icon name="database" />
        Datos
      </span>
      <span className="nav-item muted">
        <Icon name="activity" />
        Seguimiento
      </span>

      <div className="nav-spacer" />

      <Link href="/temas" className="nav-item back">
        <Icon name="back" />
        Volver a temas
      </Link>
    </aside>
  );
}
