import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { ResumenView } from "./_components/ResumenView";

export default async function ResumenPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Resumen" siglas={["OM", "RXD", "PM", "pp"]}>
      <ResumenView temaId={temaId} />
    </VistaShell>
  );
}
