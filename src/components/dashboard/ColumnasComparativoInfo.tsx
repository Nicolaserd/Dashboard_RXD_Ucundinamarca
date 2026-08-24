import { InfoDisclosure } from "./InfoDisclosure";

/**
 * Explica las columnas «Cumplidas / Sin cerrar / Atención» de la tabla
 * comparativa entre sistemas (vista Consolidado): qué cuenta cada una y cómo
 * se relacionan entre sí (Atención es un subconjunto de Sin cerrar, que a su
 * vez es el complemento de Cumplidas dentro del total).
 */
export function ColumnasComparativoInfo() {
  return (
    <InfoDisclosure resumen="Qué significan estas columnas">
      <table className="data-table">
        <caption className="sr-only">
          Significado de las columnas Cumplidas, Sin cerrar y Atención
        </caption>
        <thead>
          <tr>
            <th scope="col">Columna</th>
            <th scope="col">Cuenta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="celda-nombre">
              Cumplidas
            </th>
            <td>OM con calificación vigente = 2 (100 % de avance).</td>
          </tr>
          <tr>
            <th scope="row" className="celda-nombre">
              Sin cerrar
            </th>
            <td>Total de OM menos las cumplidas — sin importar cuánto avance tengan.</td>
          </tr>
          <tr>
            <th scope="row" className="celda-nombre">
              Atención
            </th>
            <td>
              Dentro de «Sin cerrar», las que están en 0: calificadas explícitamente con 0 o que
              nunca fueron calificadas.
            </td>
          </tr>
        </tbody>
      </table>
      <p className="escala-info-nota">
        <b>Atención</b> es un subconjunto de <b>Sin cerrar</b>: «Sin cerrar» es todo lo pendiente,
        «Atención» es la parte más urgente dentro de lo pendiente — lo que está en cero, no solo lo
        que avanza lento.
      </p>
    </InfoDisclosure>
  );
}
