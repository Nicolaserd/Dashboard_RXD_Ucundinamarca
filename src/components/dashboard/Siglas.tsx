/**
 * Significado de cada sigla usada en la interfaz. Fuente única: si una sigla
 * aparece en pantalla, su equivalencia se define aquí y en ningún otro sitio.
 */
export const SIGLAS: Record<string, string> = {
  OM: "Oportunidad de Mejora",
  RXD: "Revisión por la Dirección",
  PM: "Plan de Mejoramiento",
  pp: "puntos porcentuales",
  SGC: "Sistema de Gestión de Calidad",
  SGA: "Sistema de Gestión Ambiental",
  "SG-SST": "Sistema de Gestión de Seguridad y Salud en el Trabajo",
  SGSI: "Sistema de Gestión de Seguridad de la Información",
  SGAS: "Sistema de Gestión Antisoborno",
};

/**
 * Leyenda de siglas de una vista.
 *
 * En tablas y etiquetas el espacio obliga a abreviar, así que cada vista cierra
 * declarando qué significa cada sigla que muestra. Se listan solo las que esa
 * vista usa: una leyenda con siglas ausentes estorba en lugar de ayudar.
 *
 * @example
 * <Siglas usadas={["OM", "RXD", "pp"]} />
 */
export function Siglas({ usadas }: { usadas: string[] }) {
  const definidas = usadas.filter((sigla) => SIGLAS[sigla]);
  if (definidas.length === 0) return null;

  return (
    <dl className="siglas" aria-label="Significado de las siglas empleadas en esta vista">
      {definidas.map((sigla) => (
        <div key={sigla} className="sigla">
          <dt>{sigla}</dt>
          <dd>{SIGLAS[sigla]}</dd>
        </div>
      ))}
    </dl>
  );
}
