import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { DatosView } from "@/features/dashboard/OtrasVistas";

export default async function DatosPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title="Datos" vista="Datos" />
      <div className="canvas">
        <DatosView temaId={temaId} />
      </div>
    </div>
  );
}
