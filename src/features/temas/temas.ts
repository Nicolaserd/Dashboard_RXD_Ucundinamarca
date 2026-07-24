import type { Tema } from "@/types";

/**
 * Registro (registry) de temas. Agregar un tema es añadir una entrada aquí,
 * sin modificar la arquitectura (regla scaffolding — Abierto/Cerrado).
 */
export const TEMAS: Tema[] = [
  {
    id: "desercion-permanencia",
    icon: "heart",
    name: "Deserción y Permanencia",
    desc: "Tasas de deserción, retención y factores de riesgo académico.",
    estado: "disponible",
    upd: "Actualizado ayer",
  },
  {
    id: "bienestar-satisfaccion",
    icon: "doc",
    name: "Bienestar y Satisfacción",
    desc: "Encuestas de satisfacción, servicios y cobertura de bienestar.",
    estado: "disponible",
    upd: "Hace 3 días",
  },
  {
    id: "talento-humano",
    icon: "briefcase",
    name: "Talento Humano",
    desc: "Planta docente y administrativa, dedicación y formación.",
    estado: "disponible",
    upd: "Hace 5 días",
  },
  {
    id: "investigacion",
    icon: "flask",
    name: "Investigación",
    desc: "Grupos, proyectos y productos de investigación registrados.",
    estado: "proximamente",
    upd: "En preparación",
  },
  {
    id: "presupuesto",
    icon: "coins",
    name: "Presupuesto",
    desc: "Ejecución presupuestal e indicadores financieros por vigencia.",
    estado: "proximamente",
    upd: "En preparación",
  },
];

export function getTema(id: string): Tema | undefined {
  return TEMAS.find((t) => t.id === id);
}
