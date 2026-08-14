import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { DatosView } from "./_components/DatosView";

export default async function DatosPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Datos" siglas={["OM", "PM"]}>
      <DatosView temaId={temaId} />
    </VistaShell>
  );
}
