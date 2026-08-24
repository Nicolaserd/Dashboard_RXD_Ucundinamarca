import { PantallaCarga } from "@/components/layout/PantallaCarga";

/**
 * Vista previa de `PantallaCarga` fuera del flujo real de navegación: los
 * `loading.tsx` de Next.js solo se ven un instante durante una transición de
 * ruta, así que esta página la renderiza fija para poder revisarla con calma.
 *
 * No es parte del producto (no aparece en ningún menú); es una herramienta
 * de desarrollo. Se puede borrar sin afectar `loading.tsx`.
 */
export default function VistaPreviaCargaPage() {
  return <PantallaCarga />;
}
