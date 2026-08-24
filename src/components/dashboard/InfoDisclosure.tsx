import type { ReactNode } from "react";

/**
 * Disclosure informativo genérico: un botón «ⓘ + resumen» que despliega un
 * panel con la explicación completa. `<details>` nativo, no un tooltip: se
 * abre y cierra con teclado sin JavaScript propio, y el contenido queda
 * disponible para lectores de pantalla sin depender de hover (regla
 * dashboard §12 — tooltips solo cuando no hay espacio, y siempre con
 * alternativa accesible).
 *
 * Reutiliza las clases `.escala-info*` de `globals.css` (el nombre quedó del
 * primer uso, junto al filtro «Estado», pero el estilo es genérico). El
 * elemento que lo contiene necesita `position: relative` para que el panel
 * se posicione respecto al disclosure y no respecto a un ancestro lejano.
 */
export function InfoDisclosure({ resumen, children }: { resumen: string; children: ReactNode }) {
  return (
    <details className="escala-info">
      <summary>
        <span aria-hidden="true">ⓘ</span> {resumen}
      </summary>
      <div className="escala-info-panel">{children}</div>
    </details>
  );
}
