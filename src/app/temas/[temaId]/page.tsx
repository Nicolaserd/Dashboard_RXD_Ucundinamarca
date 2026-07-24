import { redirect } from "next/navigation";
import { getTema } from "@/features/temas/temas";

/**
 * Redirige a la vista Resumen (primera vista disponible del tema).
 * El acceso directo a /temas/:temaId debe llegar a /temas/:temaId/resumen.
 */
export default async function TemaLayoutPage({
  params,
}: {
  params: Promise<{ temaId: string }>;
}) {
  const { temaId } = await params;
  const tema = getTema(temaId);

  if (!tema || tema.estado !== "disponible") {
    redirect("/temas");
  }

  redirect(`/temas/${temaId}/resumen`);
}
