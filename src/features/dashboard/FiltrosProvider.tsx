"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { FILTROS_VACIOS, hayFiltrosActivos, type CampoFiltro, type FiltrosOM } from "@/lib/om/filtros";

/**
 * Estado de filtros compartido por todas las vistas de un tema (CLAUDE.md §5.3;
 * regla dashboard §3–4). Vive por encima de las vistas para que seleccionar un
 * elemento en una gráfica actualice KPIs, gráficas y tablas —también al navegar
 * entre vistas— sin generar filtros duplicados.
 */
interface ContextoFiltros {
  filtros: FiltrosOM;
  /** `true` si al menos un filtro restringe los datos. */
  activos: boolean;
  /** Asigna un valor a un filtro; la cadena vacía lo desactiva. */
  fijar: (campo: CampoFiltro, valor: string) => void;
  /** Alterna un valor: úsalo al hacer clic en un elemento de una gráfica. */
  alternar: (campo: CampoFiltro, valor: string) => void;
  limpiar: () => void;
}

const Contexto = createContext<ContextoFiltros | null>(null);

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [filtros, setFiltros] = useState<FiltrosOM>(FILTROS_VACIOS);

  const fijar = useCallback((campo: CampoFiltro, valor: string) => {
    setFiltros((previos) => ({ ...previos, [campo]: valor }));
  }, []);

  const alternar = useCallback((campo: CampoFiltro, valor: string) => {
    setFiltros((previos) => ({ ...previos, [campo]: previos[campo] === valor ? "" : valor }));
  }, []);

  const limpiar = useCallback(() => setFiltros(FILTROS_VACIOS), []);

  const valor = useMemo<ContextoFiltros>(
    () => ({ filtros, activos: hayFiltrosActivos(filtros), fijar, alternar, limpiar }),
    [filtros, fijar, alternar, limpiar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useFiltros(): ContextoFiltros {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("useFiltros debe usarse dentro de <FiltrosProvider>");
  return contexto;
}
