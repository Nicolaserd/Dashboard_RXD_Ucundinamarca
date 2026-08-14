import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";
import { SelloAcreditacion } from "@/components/brand/SelloAcreditacion";
import { GENERADO_EN } from "@/lib/om/dataset";
import { formatearFecha } from "@/lib/om/avance";

/**
 * Pie institucional común a la portada y a la vista consolidada.
 *
 * Declara la procedencia del tablero —quién lo elaboró y de dónde salen los
 * datos—, que es lo que permite atribuir y auditar las cifras. La fecha es la
 * de la última importación de los libros de seguimiento, no la del día en curso.
 *
 * @example
 * <PieInstitucional />
 */
export function PieInstitucional() {
  return (
    <footer className="portada-foot">
      <div className="pie-marca">
        <LogoUcundinamarca variant="horizontal" tono="negro" height={80} />
        <SelloAcreditacion height={80} />
      </div>

      <dl className="pie-creditos">
        <div>
          <dt>Elaborado por</dt>
          <dd>Gobierno de Datos</dd>
        </div>
        <div>
          <dt>Fuente</dt>
          <dd>Control Interno</dd>
        </div>
        <div>
          <dt>Datos importados el</dt>
          <dd>{formatearFecha(GENERADO_EN)}</dd>
        </div>
      </dl>
    </footer>
  );
}
