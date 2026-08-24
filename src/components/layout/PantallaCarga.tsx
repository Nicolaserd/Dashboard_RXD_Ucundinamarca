import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";

/**
 * Pantalla de carga institucional: el imagotipo en el centro, rodeado por un
 * anillo que gira. La usa Next.js automáticamente en las transiciones de
 * ruta a través de los archivos `loading.tsx` (raíz y `[temaId]`), así que no
 * hace falta invocarla a mano desde ninguna vista.
 *
 * Con `prefers-reduced-motion` el anillo deja de girar (regla global en
 * `globals.css`) y queda como un arco estático — sigue leyéndose como
 * indicador de carga, no como una animación rota a medio camino.
 */
export function PantallaCarga() {
  return (
    <div className="carga-pantalla" role="status" aria-live="polite">
      <div className="carga-anillo">
        <LogoUcundinamarca variant="vertical" tono="negro" height={52} className="carga-logo" />
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
