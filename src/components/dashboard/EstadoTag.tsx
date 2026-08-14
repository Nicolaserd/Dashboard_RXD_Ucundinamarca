interface EstadoTagProps {
  /** Color del paso de la rampa: viste la marca, nunca el texto. */
  color: string;
  /** Símbolo cuyo relleno crece con el avance (refuerzo no cromático). */
  simbolo: string;
  /** Etiqueta legible del estado o de la calificación. */
  label: string;
}

/**
 * Distintivo del estado de avance de una OM.
 *
 * El color va en la **marca** (el punto), y la etiqueta en tinta de texto: los
 * pasos claros de la rampa ordinal no alcanzan contraste de texto legible, y
 * teñir el texto con el color de serie gastaría en identidad un canal que ya
 * cubre la marca. El símbolo aporta el tercer canal, no cromático, para que la
 * categoría se distinga sin depender del color (regla dashboard §8–9, §11).
 *
 * @example
 * <EstadoTag color={colorEstado(estado)} simbolo={simboloEstado(estado)} label={etiquetaEstado(estado)} />
 */
export function EstadoTag({ color, simbolo, label }: EstadoTagProps) {
  return (
    <span className="estado-tag">
      <span className="et-punto" style={{ background: color }} aria-hidden="true" />
      <span className="et-simbolo" aria-hidden="true">
        {simbolo}
      </span>
      {label}
    </span>
  );
}
