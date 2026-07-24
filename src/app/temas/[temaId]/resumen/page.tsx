import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { ResumenView } from "./_components/ResumenView";

export default async function ResumenPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title="Resumen" vista="Resumen" />
      <div className="canvas">
        <ResumenView temaId={temaId} />
      </div>
    </div>
  );
}
