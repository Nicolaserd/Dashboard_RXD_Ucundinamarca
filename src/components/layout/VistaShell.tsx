import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Siglas } from "@/components/dashboard/Siglas";
import { getTema } from "@/features/temas/temas";
import { getSistema, ultimoCorte } from "@/lib/om/dataset";
import { formatearFecha } from "@/lib/om/avance";
import { ViewHeader } from "./ViewHeader";

/** Props que Next.js entrega a toda página bajo `/temas/[temaId]/<vista>`. */
export interface VistaPageProps {
  params: Promise<{ temaId: string }>;
}

interface VistaShellProps {
  temaId: string;
  /** Nombre de la vista: encabeza la página y cierra la miga de pan. */
  titulo: string;
  /** Siglas que aparecen en esta vista; se explican al pie. */
  siglas?: string[];
  children: ReactNode;
}

/**
 * Envoltura común de las páginas del layout interno (regla layouts §11).
 *
 * Valida el tema, arma el encabezado y el lienzo. El contenedor `.main` lo
 * aporta `app/temas/[temaId]/layout.tsx`, por lo que aquí no se repite.
 *
 * @example
 * export default async function ResumenPage({ params }: VistaPageProps) {
 *   const { temaId } = await params;
 *   return (
 *     <VistaShell temaId={temaId} titulo="Resumen">
 *       <ResumenView temaId={temaId} />
 *     </VistaShell>
 *   );
 * }
 */
export function VistaShell({ temaId, titulo, siglas, children }: VistaShellProps) {
  const tema = getTema(temaId);
  if (!tema || tema.estado !== "disponible") notFound();

  const corte = ultimoCorte(getSistema(temaId)?.oms ?? []);

  return (
    <>
      <ViewHeader
        temaId={temaId}
        temaName={tema.name}
        title={titulo}
        vista={titulo}
        periodo={`Corte ${formatearFecha(corte)}`}
      />
      <div className="canvas">
        {children}
        {siglas && <Siglas usadas={siglas} />}
      </div>
    </>
  );
}
