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
