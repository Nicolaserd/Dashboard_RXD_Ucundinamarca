import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

/**
 * Tipografía institucional: Montserrat (regla visual §3.1).
 * Nota: la regla PROHÍBE Inter/Geist como principal (§3.5); por eso se
 * reemplaza la fuente por defecto de create-next-app por Montserrat.
 */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tableros institucionales · Universidad de Cundinamarca",
  description:
    "Portal de tableros de gestión e indicadores de la Universidad de Cundinamarca.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
