/**
 * Identificador institucional — encapsula TODAS las reglas del logo (regla visual §2).
 * Nadie debe insertar un <img> de logo suelto: usar siempre este componente (DRY).
 *
 * - `horizontal` es el identificador principal en interfaces digitales (§2.1).
 * - `vertical` solo cuando el espacio sea reducido (§2.1).
 * - `negro`/`blanco` = versión monocromática según el fondo; `color` = policromía.
 * - Mantiene relación de aspecto con object-fit: contain; nunca deformar (§2.4).
 * - Los archivos oficiales viven en /public/brand (copiados desde .claude/lmagenes).
 */
type Variant = "horizontal" | "vertical";
type Tono = "negro" | "blanco" | "color";

export function LogoUcundinamarca({
  variant = "horizontal",
  tono = "negro",
  height = 40,
  className,
}: {
  variant?: Variant;
  tono?: Tono;
  height?: number;
  className?: string;
}) {
  const src = `/brand/imagotipo-${variant}-${tono}.png`;
  return (
    // Se usa <img> (no next/image) según el ejemplo de la regla visual §2.6;
    // el imagotipo es un PNG con relación de aspecto variable.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Universidad de Cundinamarca"
      className={`logo-img${className ? ` ${className}` : ""}`}
      style={{ height }}
    />
  );
}
