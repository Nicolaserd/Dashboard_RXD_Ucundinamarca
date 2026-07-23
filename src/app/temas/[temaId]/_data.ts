import type { CategoriaValor, Kpi, PuntoSerie, Segmento } from "@/types";

/**
 * Datos de demostración de la vista Resumen — COLOCADOS con la vista
 * (regla scaffolding §4): solo se usan aquí. En la app real vendrían de la
 * capa de datos (hooks/`lib`) por inversión de dependencias.
 */

export const SEDES: CategoriaValor[] = [
  { name: "Fusagasugá", value: 8420 },
  { name: "Soacha", value: 5320 },
  { name: "Facatativá", value: 4180 },
  { name: "Girardot", value: 3150 },
  { name: "Ubaté", value: 2260 },
  { name: "Chía", value: 1980 },
  { name: "Chocontá", value: 1240 },
];

export const PERIODOS: PuntoSerie[] = [
  { label: "2023-I", value: 24100 },
  { label: "2023-II", value: 24980 },
  { label: "2024-I", value: 25640 },
  { label: "2024-II", value: 26210 },
  { label: "2025-I", value: 26050 },
  { label: "2025-II", value: 25980 },
  { label: "2026-I", value: 26550 },
];

/** Colores tomados de tokens institucionales (no HEX sueltos). Paleta validada CVD. */
export const NIVEL: Segmento[] = [
  { label: "Pregrado", value: 78, color: "var(--uc-green)" },
  { label: "Posgrado", value: 14, color: "var(--uc-turquoise)" },
  { label: "Educación continua", value: 8, color: "var(--uc-gold)" },
];

export const FACULTAD: CategoriaValor[] = [
  { name: "C. Agropecuarias", value: 5120 },
  { name: "Ingeniería", value: 4890 },
  { name: "C. Administrativas", value: 4560 },
  { name: "Educación", value: 3980 },
  { name: "C. del Deporte", value: 2340 },
  { name: "C. Sociales", value: 1660 },
];

export const MODALIDAD: CategoriaValor[] = [
  { name: "Presencial", value: 2960 },
  { name: "Distancia", value: 760 },
  { name: "Virtual", value: 400 },
];

export const KPIS: Kpi[] = [
  { label: "Matrícula total", value: "26.550", delta: "▲ 3,2%", tono: "up", spark: [24100, 24980, 25640, 26210, 26050, 25980, 26550] },
  { label: "Nuevos admitidos", value: "4.120", delta: "▲ 5,1%", tono: "up", spark: [3200, 3400, 3550, 3700, 3820, 3950, 4120] },
  { label: "Tasa de deserción", value: "8,4%", delta: "▼ 1,2 pp", tono: "down-good", spark: [11, 10.6, 10.1, 9.6, 9.2, 8.8, 8.4] },
  { label: "Satisfacción estudiantil", value: "87%", delta: "▲ 2 pp", tono: "up", spark: [80, 81, 82, 84, 85, 85, 87] },
];
