import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del workspace: hay un package-lock.json huérfano en el
  // directorio padre (D:\ninchaustegui\Desktop\RXD) que Next.js confunde con
  // otro workspace, ver aviso "multiple lockfiles" en consola.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  /**
   * Oculta el indicador de desarrollo de Next.js: el círculo oscuro que se
   * superponía sobre el menú lateral en la esquina inferior izquierda.
   *
   * Es chrome del framework (`<nextjs-portal>`), no un elemento de la interfaz,
   * y nunca formó parte del build de producción. Se apaga porque en este
   * proyecto la pantalla se revisa y se presenta en desarrollo, y ahí tapaba
   * «Volver a temas».
   */
  devIndicators: false,
};

export default nextConfig;
