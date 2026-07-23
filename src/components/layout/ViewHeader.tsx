import { Icon } from "@/components/ui/Icon";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";

/**
 * Encabezado superior del layout interno (regla layouts §9).
 * El logo institucional va en la esquina superior derecha, visible en todas
 * las vistas (§10). Altura estable entre vistas.
 */
export function ViewHeader({
  temaName,
  title,
  vista = "Resumen",
}: {
  temaName: string;
  title: string;
  vista?: string;
}) {
  return (
    <header className="view-head">
      <div>
        <div className="crumbs">
          Temas · <b>{temaName}</b> · {vista}
        </div>
        <h1>{title}</h1>
      </div>
      <div className="vh-spacer" />
      <span className="periodo">
        <Icon name="calendar" />
        Periodo 2026-I
      </span>
      <LogoUcundinamarca variant="horizontal" tono="negro" height={38} className="vh-logo" />
    </header>
  );
}
