"use client";

import { useCallback, useMemo } from "react";
import type { OportunidadMejora, SistemaGestion } from "@/types";
import { getSistema } from "@/lib/om/dataset";
import { ESTADOS } from "@/lib/om/avance";
import { aplicarFiltros, areasDe, vigenciasDe, type CampoFiltro, type FiltrosOM } from "@/lib/om/filtros";
import { estadoDeOM } from "@/lib/om/avance";
import type { FilterConfig } from "@/components/dashboard/FilterBar";
import { EscalaAvanceInfo } from "@/components/dashboard/EscalaAvanceInfo";
import { useFiltros } from "./FiltrosProvider";

export interface TableroOM {
  sistema: SistemaGestion | undefined;
  /** Universo completo de OM del sistema, sin filtrar. */
  todas: OportunidadMejora[];
  /** OM que superan los filtros activos: la base de toda la vista. */
  oms: OportunidadMejora[];
  /**
   * OM filtradas ignorando un campo. Lo usa la gráfica que filtra por ese mismo
   * campo: si se filtrara a sí misma quedaría reducida a la categoría elegida y
   * dejaría de mostrar el contexto sobre el que se hizo la selección.
   */
  omsIgnorando: (campo: CampoFiltro) => OportunidadMejora[];
  filtros: FiltrosOM;
  activos: boolean;
  /** Controles de la barra de filtros, derivados de los datos reales. */
  controles: FilterConfig[];
  fijar: (campo: CampoFiltro, valor: string) => void;
  alternar: (campo: CampoFiltro, valor: string) => void;
  limpiar: () => void;
}

/**
 * Punto de entrada de datos de todas las vistas del tablero (SOLID «D»: la UI
 * depende de esta abstracción, no de un origen concreto).
 *
 * Devuelve el conjunto ya filtrado y los controles de filtro construidos a
 * partir de los valores que existen en los datos, de modo que ninguna opción
 * ofrezca un resultado vacío por construcción (regla dashboard §4, §6).
 *
 * @example
 * const { oms, controles, filtros, fijar, limpiar } = useTableroOM(temaId);
 */
export function useTableroOM(temaId: string): TableroOM {
  const { filtros, activos, fijar, alternar, limpiar } = useFiltros();

  const sistema = useMemo(() => getSistema(temaId), [temaId]);
  const todas = useMemo(() => sistema?.oms ?? [], [sistema]);
  const oms = useMemo(() => aplicarFiltros(todas, filtros), [todas, filtros]);

  const omsIgnorando = useCallback(
    (campo: CampoFiltro) => aplicarFiltros(todas, { ...filtros, [campo]: "" }),
    [todas, filtros],
  );

  const controles = useMemo<FilterConfig[]>(() => {
    const estadosPresentes = new Set(todas.map(estadoDeOM));
    return [
      {
        id: "vigencia",
        label: "Vigencia",
        options: vigenciasDe(todas).map((vigencia) => ({ value: vigencia, label: vigencia })),
      },
      {
        id: "estado",
        label: "Estado",
        options: ESTADOS.filter((estado) => estadosPresentes.has(estado.id)).map((estado) => ({
          value: estado.id,
          label: estado.label,
        })),
        ayuda: <EscalaAvanceInfo />,
      },
      {
        id: "area",
        label: "Área responsable",
        options: areasDe(todas).map((area) => ({ value: area, label: area })),
      },
    ];
  }, [todas]);

  return { sistema, todas, oms, omsIgnorando, filtros, activos, controles, fijar, alternar, limpiar };
}
