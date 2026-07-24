import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { SeguimientoView } from "./_components/SeguimientoView";

export default async function SeguimientoPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Seguimiento">
      <SeguimientoView temaId={temaId} />
    </VistaShell>
  );
}
