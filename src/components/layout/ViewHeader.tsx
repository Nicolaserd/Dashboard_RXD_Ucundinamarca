import { Icon } from "@/components/ui/Icon";
import { LogoSistema } from "@/components/brand/LogoSistema";
import { SelloAcreditacion } from "@/components/brand/SelloAcreditacion";

/**
 * Encabezado superior del layout interno (regla layouts §9).
 * Altura estable entre vistas.
 *
 * Lleva el logotipo del sistema de gestión: dentro del tablero es el dato que
 * dice «en qué sistema estoy», y acompaña a la miga de pan en todas las vistas.
 * El identificador institucional sigue siendo el imagotipo del menú lateral
 * (regla visual §2.1): este es un identificador secundario, no lo sustituye.
 *
 * En la esquina superior derecha va el sello de Acreditación Institucional,
 * visible en todas las vistas (regla layouts §10).
 */
export function ViewHeader({
  temaId,
  temaName,
  title,
  vista = "Resumen",
  periodo,
}: {
  temaId: string;
  temaName: string;
  title: string;
  vista?: string;
  /** Corte de seguimiento vigente; encuadra temporalmente lo que se muestra. */
  periodo: string;
}) {
  return (
    <header className="view-head">
      {/* Estos logotipos llevan el nombre del sistema dentro del arte, así que
          no se reducen más de la cuenta (regla visual §2.5). */}
      <LogoSistema id={temaId} nombre={temaName} height={58} className="vh-logo" />
      <div>
        <div className="crumbs">
          Temas · <b>{temaName}</b> · {vista}
        </div>
        <h1>{title}</h1>
      </div>
      <div className="vh-spacer" />
      <span className="periodo">
        <Icon name="calendar" />
        {periodo}
      </span>
      <SelloAcreditacion height={72} />
    </header>
  );
}
