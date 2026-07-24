/**
 * Estado vacío informativo para cuando un filtro no produce resultados
 * (regla dashboard §4, §9 «Sin datos»).
 */
export function EstadoVacio({ mensaje }: { mensaje?: string }) {
  return (
    <div className="estado-vacio">
      <div className="ev-ic" aria-hidden="true">
        ∅
      </div>
      <p>{mensaje ?? "No existen datos para los filtros seleccionados."}</p>
    </div>
  );
}
