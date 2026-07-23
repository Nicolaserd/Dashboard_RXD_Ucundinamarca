import { redirect } from "next/navigation";

/** La aplicación arranca en la portada de temas (regla layouts §3). */
export default function Home() {
  redirect("/temas");
}
