import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { IndicadoresView } from "@/features/dashboard/IndicadoresView";

export default async function IndicadoresPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title="Indicadores" vista="Indicadores" />
      <div className="canvas">
        <IndicadoresView temaId={temaId} />
      </div>
    </div>
  );
}
