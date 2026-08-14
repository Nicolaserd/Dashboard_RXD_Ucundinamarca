import datos from "@/data/om-rxd.json";
import type { OportunidadMejora, SistemaGestion } from "@/types";

/**
 * Punto de acceso ÚNICO al dataset de Oportunidades de Mejora (CLAUDE.md §6, «D»).
 *
 * La interfaz depende de estas funciones, no del origen concreto de los datos.
 * Hoy el origen es el JSON generado por `pnpm datos:importar` a partir de los
 * libros de `data/`; sustituirlo por una API o un modelo semántico solo exige
 * cambiar este módulo.
 */

const DATASET = datos as unknown as {
  generadoEn: string;
  escalaClasificacion: number[];
  sistemas: SistemaGestion[];
};

/** Todos los sistemas de gestión con seguimiento cargado. */
export const SISTEMAS: SistemaGestion[] = DATASET.sistemas;

/** Fecha (ISO) en que se generó el dataset desde los libros de origen. */
export const GENERADO_EN: string = DATASET.generadoEn;

/** Escala institucional de clasificación: `[0, 0.5, 1, 1.5, 2]`. */
export const ESCALA_CLASIFICACION: number[] = DATASET.escalaClasificacion;

export function getSistema(id: string): SistemaGestion | undefined {
  return SISTEMAS.find((sistema) => sistema.id === id);
}

/** Todas las OM de todos los sistemas, para las cifras globales de la portada. */
export function getTodasLasOM(): OportunidadMejora[] {
  return SISTEMAS.flatMap((sistema) => sistema.oms);
}

/** Fecha del corte de seguimiento más reciente registrado en un conjunto de OM. */
export function ultimoCorte(oms: OportunidadMejora[]): string | null {
  let ultimo: string | null = null;
  for (const om of oms) {
    for (const seguimiento of om.seguimientos) {
      if (!ultimo || seguimiento.corte > ultimo) ultimo = seguimiento.corte;
    }
  }
  return ultimo;
}
