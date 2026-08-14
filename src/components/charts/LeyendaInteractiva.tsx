"use client";

export interface ItemLeyenda {
  /** Valor que se envía al filtro al activar el elemento. */
  clave: string;
  label: string;
  /**
   * Color de la categoría, idéntico al usado en la gráfica (§10). Se omite
   * cuando la gráfica no codifica la categoría con color.
   */
  color?: string;
  /** Valor ya formateado que acompaña a la etiqueta. */
  valor: string;
  /** Refuerzo no cromático de la categoría (§8–9, §11). */
  simbolo?: string;
}

interface LeyendaInteractivaProps {
  items: ItemLeyenda[];
  /** Clave seleccionada, o `null` si no hay selección. */
  seleccionado?: string | null;
  /** Alterna la selección. Si se omite, la leyenda es solo informativa. */
  onSelect?: (clave: string) => void;
  /** Texto accesible que describe qué se filtra al activar un elemento. */
  descripcion?: string;
}

/**
 * Leyenda de categorías que además actúa como control de filtro
 * (regla dashboard §2 «leyenda», §3 «interacción como filtro», §11 «teclado»).
 *
 * Resuelve el punto que las gráficas de Recharts no cubren por sí solas: sus
 * segmentos y barras no son focalizables, así que esta leyenda ofrece el mismo
 * filtro mediante botones accesibles con teclado. El estado seleccionado se
 * marca con color, borde, símbolo y `aria-pressed`, nunca solo con color.
 *
 * @example
 * <LeyendaInteractiva items={items} seleccionado={filtros.estado} onSelect={(v) => alternar("estado", v)} />
 */
export function LeyendaInteractiva({
  items,
  seleccionado,
  onSelect,
  descripcion,
}: LeyendaInteractivaProps) {
  if (items.length === 0) return null;

  return (
    <ul className="leyenda" aria-label={descripcion ?? "Leyenda de categorías"}>
      {items.map((item) => {
        const activo = seleccionado === item.clave;
        const contenido = (
          <>
            {item.color && (
              <span className="lg-color" style={{ background: item.color }} aria-hidden="true" />
            )}
            {item.simbolo && (
              <span className="lg-simbolo" aria-hidden="true">
                {item.simbolo}
              </span>
            )}
            <span className="lg-label">{item.label}</span>
            <b className="lg-valor">{item.valor}</b>
          </>
        );

        if (!onSelect) {
          return (
            <li key={item.clave} className="lg-item">
              {contenido}
            </li>
          );
        }

        return (
          <li key={item.clave}>
            <button
              type="button"
              className={`lg-item lg-boton${activo ? " activo" : ""}`}
              aria-pressed={activo}
              onClick={() => onSelect(item.clave)}
            >
              {contenido}
              {activo && (
                <span className="lg-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
