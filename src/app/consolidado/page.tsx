import Link from "next/link";
import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";
import { SelloAcreditacion } from "@/components/brand/SelloAcreditacion";
import { PieInstitucional } from "@/components/layout/PieInstitucional";
import { Siglas } from "@/components/dashboard/Siglas";
import { Icon } from "@/components/ui/Icon";
import { ConsolidadoView } from "./_components/ConsolidadoView";

export const metadata = {
  title: "Todos los sistemas de gestión",
  description:
    "Estado vigente de las oportunidades de mejora en todos los sistemas de gestión de la Universidad de Cundinamarca.",
};

/**
 * Vista consolidada: compara **todos** los sistemas de gestión entre sí.
 *
 * Es una ruta de primer nivel y no una vista del layout interno porque su
 * dimensión de análisis es el propio sistema, mientras que aquel está construido
 * para trabajar dentro de uno solo (menú lateral y filtros por tema). Conserva
 * la cabecera institucional de la portada para que la jerarquía se mantenga.
 */
export default function ConsolidadoPage() {
  return (
    <>
      <header className="topbar">
        <LogoUcundinamarca variant="horizontal" tono="negro" height={80} />
        <div className="spacer" />
        <div className="top-actions">
          <Link href="/temas" className="volver-link">
            <Icon name="back" size={15} />
            Volver a temas
          </Link>
          <SelloAcreditacion height={72} />
        </div>
      </header>

      <div className="consolidado-head">
        <div className="eyebrow">Revisión por la Dirección · Visión consolidada</div>
        <h1>Todos los sistemas de gestión</h1>
        <p>
          Estado vigente de las oportunidades de mejora en cada sistema, con su corte de seguimiento
          más reciente. Permite comparar avance, cierre y carga pendiente entre sistemas antes de
          entrar al tablero de uno en particular.
        </p>
      </div>

      <div className="consolidado-canvas">
        <ConsolidadoView />
        <Siglas usadas={["OM", "RXD", "pp", "SGC", "SGA", "SG-SST", "SGSI", "SGAS"]} />
      </div>

      <PieInstitucional />
    </>
  );
}
