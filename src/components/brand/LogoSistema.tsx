/**
 * Logotipo de un sistema de gestión (SGC, SGA, SG-SST, SGSI, SGAS).
 *
 * Es un identificador **secundario**: acompaña al del sistema dentro de su
 * tablero, sin sustituir al imagotipo institucional, que sigue siendo el
 * identificador principal de la interfaz (regla visual §2.1). Como todo
 * identificador, se inserta solo por este componente —nunca un `<img>` suelto—
 * y conserva su relación de aspecto con `object-fit: contain` (§2.4).
 *
 * Los archivos viven en `/public/brand/sistemas/<id>.png`, copiados desde
 * `imagenes/` (ver README §Estructura). Todos son PNG con transparencia y la
 * misma proporción, así que basta con fijar la altura.
 *
 * @example
 * <LogoSistema id="sgc" nombre="Sistema de Gestión de Calidad" height={56} />
 */
export function LogoSistema({
  id,
  nombre,
  height = 48,
  className,
}: {
  /** Identificador del sistema en el registro de temas (`sgc`, `sga`…). */
  id: string;
  /** Nombre completo del sistema: es el texto alternativo de la imagen. */
  nombre: string;
  height?: number;
  className?: string;
}) {
  return (
    // <img> por coherencia con LogoUcundinamarca (regla visual §2.6): son PNG
    // institucionales servidos desde /public, sin necesidad de optimización.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/brand/sistemas/${id}.png`}
      alt={`Logotipo del ${nombre}`}
      className={`logo-sistema${className ? ` ${className}` : ""}`}
      style={{ height }}
    />
  );
}
