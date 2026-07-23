/** Formato numérico en español de Colombia (separador de miles ".", §regla dashboard §2). */
export const fmt = (n: number): string => n.toLocaleString("es-CO");

/** Formato de porcentaje con símbolo (regla dashboard §2). */
export const fmtPct = (n: number): string => `${n.toLocaleString("es-CO")}%`;
