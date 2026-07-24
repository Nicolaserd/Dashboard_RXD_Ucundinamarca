import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getTema } from "@/features/temas/temas";

/**
 * Layout 2 — Navegación interna (regla layouts §6–8). Estructura fija y
 * reutilizable: menú lateral + área de contenido. El contenido (`children`)
 * cambia sin alterar la estructura.
 */
export default async function TemaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);
  if (!tema || tema.estado !== "disponible") notFound();

  return (
    <div className="interno">
      <Sidebar temaId={temaId} />
      <main className="main">{children}</main>
    </div>
  );
}
