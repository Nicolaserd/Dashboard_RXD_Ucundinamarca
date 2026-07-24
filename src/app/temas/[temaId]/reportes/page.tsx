import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { ReportesView } from "./_components/ReportesView";

export default async function ReportesPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Reportes">
      <ReportesView temaId={temaId} />
    </VistaShell>
  );
}
