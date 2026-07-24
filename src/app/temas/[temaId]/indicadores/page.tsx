import { VistaShell, type VistaPageProps } from "@/components/layout/VistaShell";
import { IndicadoresView } from "./_components/IndicadoresView";

export default async function IndicadoresPage({ params }: VistaPageProps) {
  const { temaId } = await params;

  return (
    <VistaShell temaId={temaId} titulo="Indicadores">
      <IndicadoresView temaId={temaId} />
    </VistaShell>
  );
}
