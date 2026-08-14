import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LogoSistema } from "@/components/brand/LogoSistema";
import type { Tema } from "@/types";

/**
 * Tarjeta de tema reutilizable (regla layouts §4.3). Estructura visual idéntica
 * para todos los temas; los disponibles enlazan al layout interno, los
 * "próximamente" se muestran deshabilitados.
 */
export function TarjetaTema({ tema }: { tema: Tema }) {
  const disponible = tema.estado === "disponible";

  const contenido = (
    <>
      <div className="tc-top">
        <LogoSistema id={tema.id} nombre={tema.name} height={84} />
        <span className={`badge ${disponible ? "ok" : "soon"}`}>
          <span className="dot" />
          {disponible ? "Disponible" : "Próximamente"}
        </span>
      </div>
      {/* El logotipo ya nombra al sistema, pero el encabezado es lo que da la
          jerarquía del documento y lo que leen los lectores de pantalla. */}
      <h3>{tema.name}</h3>
      <p>{tema.desc}</p>
      {tema.detalle && <p className="tc-detalle">{tema.detalle}</p>}
      <div className="tc-foot">
        <span className="upd">{tema.upd}</span>
        {disponible ? (
          <span className="tc-enter">
            Ingresar <Icon name="arrowRight" size={15} />
          </span>
        ) : (
          <span className="upd">—</span>
        )}
      </div>
    </>
  );

  if (!disponible) {
    return (
      <div className="theme-card disabled" aria-disabled="true">
        {contenido}
      </div>
    );
  }

  return (
    <Link href={`/temas/${tema.id}/resumen`} className="theme-card">
      {contenido}
    </Link>
  );
}
