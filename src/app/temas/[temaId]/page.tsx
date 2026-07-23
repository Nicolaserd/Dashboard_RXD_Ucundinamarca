import { notFound } from "next/navigation";
import { ViewHeader } from "@/components/layout/ViewHeader";
import { getTema } from "@/features/temas/temas";
import { ResumenDashboard } from "./_components/ResumenDashboard";

/** Vista Resumen del tema (área principal del layout interno). */
export default async function TemaResumenPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);
  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <>
      <ViewHeader temaName={tema.name} title="Resumen de matrícula" />
      <ResumenDashboard />
    </>
  );
}
