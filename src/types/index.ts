/** Tipos de dominio compartidos. */

export type IconName =
  | "doc"
  | "users"
  | "heart"
  | "briefcase"
  | "flask"
  | "coins";

export type EstadoTema = "disponible" | "proximamente";

export interface Tema {
  id: string;
  icon: IconName;
  name: string;
  desc: string;
  estado: EstadoTema;
  upd: string;
}

/** Categoría con nombre y valor numérico (barras, líneas). */
export interface CategoriaValor {
  name: string;
  value: number;
}

/** Punto de serie temporal. */
export interface PuntoSerie {
  label: string;
  value: number;
}

/** Segmento de composición (donut) — el color viene de un token institucional. */
export interface Segmento {
  label: string;
  value: number;
  color: string;
}

/** Indicador resumen (KPI). */
export interface Kpi {
  label: string;
  value: string;
  delta: string;
  tono: "up" | "down-good" | "caution";
  spark: number[];
}
