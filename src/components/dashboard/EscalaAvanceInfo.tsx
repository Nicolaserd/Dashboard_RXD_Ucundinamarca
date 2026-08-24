"use client";

import { CLASIFICACION_MAXIMA, ESTADOS } from "@/lib/om/avance";
import { EstadoTag } from "./EstadoTag";

/**
 * Explica la escala institucional de avance junto al filtro «Estado»: qué
 * calificación (0 · 0.5 · 1 · 1.5 · 2) corresponde a cada estado y a qué
 * porcentaje de avance equivale.
 *
 * `<details>` nativo en vez de un tooltip: se abre y cierra con teclado sin
 * JavaScript propio, y el contenido queda disponible para lectores de
 * pantalla sin depender de hover (regla dashboard §12 — tooltips solo cuando
 * no hay espacio, y siempre con alternativa accesible).
 */
export function EscalaAvanceInfo() {
  return (
    <details className="escala-info">
      <summary>
        <span aria-hidden="true">ⓘ</span> Qué significa cada estado
      </summary>
      <div className="escala-info-panel">
        <table className="data-table">
          <caption className="sr-only">
            Escala institucional de avance: calificación, estado y porcentaje equivalente
          </caption>
          <thead>
            <tr>
              <th scope="col">Estado</th>
              <th scope="col" className="num">
                Calificación
              </th>
              <th scope="col" className="pct">
                Avance
              </th>
            </tr>
          </thead>
          <tbody>
            {ESTADOS.map((estado) => (
              <tr key={estado.id}>
                <th scope="row" className="celda-nombre">
                  <EstadoTag color={estado.color} simbolo={estado.simbolo} label={estado.label} />
                </th>
                <td className="num">{estado.clasificacion}</td>
                <td className="pct">{Math.round((estado.clasificacion / CLASIFICACION_MAXIMA) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="escala-info-nota">
          El estado de una OM es su <b>última calificación registrada</b>, no un promedio del
          historial. Una OM que nunca fue calificada cuenta como <b>Sin avance</b>.
        </p>
      </div>
    </details>
  );
}
