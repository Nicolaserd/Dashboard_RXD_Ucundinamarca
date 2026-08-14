/**
 * Sello de Acreditación Institucional de Alta Calidad.
 *
 * Distintivo institucional, no un identificador: acompaña al imagotipo sin
 * sustituirlo (regla visual §2.1). Se muestra en la esquina superior derecha de
 * todas las vistas del tablero.
 *
 * El brillo metálico que lo recorre lo aporta un pseudo-elemento **enmascarado
 * con la propia imagen** (`mask-image`), de modo que el destello solo cubre los
 * píxeles opacos del sello y no dibuja un rectángulo sobre su fondo
 * transparente. El sello en sí no se altera: no se recolorea, deforma ni recorta
 * (§2.4); el brillo es una capa aparte, decorativa y sin interacción.
 *
 * @example
 * <SelloAcreditacion height={46} />
 */
export function SelloAcreditacion({
  height = 46,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <span className={`sello${className ? ` ${className}` : ""}`} style={{ height, width: height }}>
      {/* <img> por coherencia con los demás identificadores institucionales. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/sello-acreditacion.png"
        alt="Acreditación Institucional de Alta Calidad — Universidad de Cundinamarca"
        className="sello-img"
      />
      <span className="sello-brillo" aria-hidden="true" />
    </span>
  );
}
