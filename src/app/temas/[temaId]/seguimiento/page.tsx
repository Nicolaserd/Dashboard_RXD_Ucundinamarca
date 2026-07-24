import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { SeguimientoView } from "@/features/dashboard/OtrasVistas";

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title="Seguimiento" vista="Seguimiento" />
      <div className="canvas">
        <SeguimientoView temaId={temaId} />
      </div>
    </div>
  );
}
