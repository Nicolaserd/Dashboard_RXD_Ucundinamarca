import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { ResponsablesView } from "./_components/ResponsablesView";

export default async function ResponsablesPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Responsables" siglas={["OM"]}>
      <ResponsablesView temaId={temaId} />
    </VistaShell>
  );
}
