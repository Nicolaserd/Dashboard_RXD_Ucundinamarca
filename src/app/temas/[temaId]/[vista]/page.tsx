import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { ResumenView } from "@/features/dashboard/ResumenView";
import { IndicadoresView } from "@/features/dashboard/IndicadoresView";
import { ReportesView, DatosView, SeguimientoView } from "@/features/dashboard/OtrasVistas";

const VISTAS_VALIDAS = ["resumen", "indicadores", "reportes", "datos", "seguimiento"];

export default async function VistaPage({
  params,
}: {
  params: Promise<{ temaId: string; vista: string }>;
}) {
  const { temaId, vista } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();
  if (!VISTAS_VALIDAS.includes(vista)) notFound();

  const vistaNormalizada = vista.charAt(0).toUpperCase() + vista.slice(1);

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title={vistaNormalizada} vista={vistaNormalizada} />
      <div className="canvas">
        {vista === "resumen" && <ResumenView temaId={temaId} />}
        {vista === "indicadores" && <IndicadoresView temaId={temaId} />}
        {vista === "reportes" && <ReportesView temaId={temaId} />}
        {vista === "datos" && <DatosView temaId={temaId} />}
        {vista === "seguimiento" && <SeguimientoView temaId={temaId} />}
      </div>
    </div>
  );
}
