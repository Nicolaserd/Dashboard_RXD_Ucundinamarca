import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { ReportesView } from "@/features/dashboard/OtrasVistas";

export default async function ReportesPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="main">
      <ViewHeader temaName={tema.name} title="Reportes" vista="Reportes" />
      <div className="canvas">
        <ReportesView temaId={temaId} />
      </div>
    </div>
  );
}
