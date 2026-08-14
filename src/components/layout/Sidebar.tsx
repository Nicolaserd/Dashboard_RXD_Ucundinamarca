"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";

interface SidebarProps {
  temaId: string;
}

/**
 * Menú lateral fijo, siempre visible, NO colapsable (regla layouts §8).
 * Reutilizable para todos los temas; el estado activo se señala con más de un
 * recurso (fondo + barra indicadora + peso tipográfico), no solo color (§8.3).
 * Cada vista es una carpeta independiente en el App Router.
 */
export function Sidebar({ temaId }: SidebarProps) {
  const pathname = usePathname();

  const vistas = [
    { id: "resumen", label: "Resumen", icon: "grid" },
    { id: "indicadores", label: "Indicadores", icon: "bars" },
    { id: "responsables", label: "Responsables", icon: "users" },
    { id: "datos", label: "Datos", icon: "database" },
    { id: "seguimiento", label: "Seguimiento", icon: "activity" },
  ] as const;

  const vistaActiva = vistas.find(
    (v) => pathname === `/temas/${temaId}/${v.id}`
  )?.id;

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <LogoUcundinamarca variant="horizontal" tono="blanco" height={90} />
      </div>

      <div className="nav-label">Vistas</div>
      {vistas.map((vista) => (
        <Link
          key={vista.id}
          href={`/temas/${temaId}/${vista.id}`}
          className={`nav-item ${vistaActiva === vista.id ? "active" : ""}`}
          aria-current={vistaActiva === vista.id ? "page" : undefined}
        >
          <Icon name={vista.icon} />
          {vista.label}
        </Link>
      ))}

      <div className="nav-spacer" />

      {/* Salto directo a la comparación entre sistemas, sin pasar por la portada. */}
      <Link href="/consolidado" className="nav-item back">
        <Icon name="grid" />
        Todos los sistemas
      </Link>

      <Link href="/temas" className="nav-item back sin-borde">
        <Icon name="back" />
        Volver a temas
      </Link>
    </aside>
  );
}
