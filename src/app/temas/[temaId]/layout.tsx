import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getTema } from "@/features/temas/temas";
import { FiltrosProvider } from "@/features/dashboard/FiltrosProvider";

/**
 * Layout 2 — Navegación interna (regla layouts §6–8). Estructura fija y
 * reutilizable: menú lateral + área de contenido. El contenido (`children`)
 * cambia sin alterar la estructura.
 *
 * El proveedor de filtros envuelve a todas las vistas del tema para que la
 * selección se conserve al navegar entre ellas y una misma selección alimente
 * KPIs, gráficas y tablas (regla dashboard §4; CLAUDE.md §5.3).
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
    <FiltrosProvider>
      <div className="interno">
        <Sidebar temaId={temaId} />
        <main className="main">{children}</main>
      </div>
    </FiltrosProvider>
  );
}
