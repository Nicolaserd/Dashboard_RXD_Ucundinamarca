"use client";

import { CLASIFICACION_MAXIMA, ESTADOS } from "@/lib/om/avance";
import { EstadoTag } from "./EstadoTag";
import { InfoDisclosure } from "./InfoDisclosure";

/**
 * Explica la escala institucional de avance junto al filtro «Estado»: qué
 * calificación (0 · 0.5 · 1 · 1.5 · 2) corresponde a cada estado y a qué
 * porcentaje de avance equivale.
 */
export function EscalaAvanceInfo() {
  return (
    <InfoDisclosure resumen="Qué significa cada estado">
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
    </InfoDisclosure>
  );
}
