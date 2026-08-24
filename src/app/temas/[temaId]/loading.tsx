import { PantallaCarga } from "@/components/layout/PantallaCarga";

/**
 * Carga al cambiar de vista dentro de un tema. Solo envuelve `children` del
 * layout ([temaId]/layout.tsx): el menú lateral y el encabezado permanecen
 * fijos mientras se carga la vista siguiente (regla layouts §11).
 */
export default function Loading() {
  return <PantallaCarga />;
}
