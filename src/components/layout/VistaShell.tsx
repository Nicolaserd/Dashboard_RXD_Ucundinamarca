import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTema } from "@/features/temas/temas";
import { ViewHeader } from "./ViewHeader";

/** Props que Next.js entrega a toda página bajo `/temas/[temaId]/<vista>`. */
export interface VistaPageProps {
  params: Promise<{ temaId: string }>;
}

interface VistaShellProps {
  temaId: string;
  /** Nombre de la vista: encabeza la página y cierra la miga de pan. */
  titulo: string;
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
export function VistaShell({ temaId, titulo, children }: VistaShellProps) {
  const tema = getTema(temaId);
  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <>
      <ViewHeader temaName={tema.name} title={titulo} vista={titulo} />
      <div className="canvas">{children}</div>
    </>
  );
}
