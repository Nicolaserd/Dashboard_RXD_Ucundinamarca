"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { ANIMACION_MS, EJE, OPACIDAD_ATENUADA, REJILLA, TOOLTIP } from "./estilos";
import { LeyendaInteractiva } from "./LeyendaInteractiva";

export interface BarraCategoria {
  /** Valor que se envía al filtro al seleccionar la barra. */
  clave: string;
  /** Etiqueta mostrada en el eje de categorías. */
  etiqueta: string;
  valor: number;
  /** Aclaración que acompaña al valor en el tooltip («12 de 18 cumplidas»). */
  detalle?: string;
}

/**
 * Umbral a partir del cual se omite la leyenda de botones: con muchas
 * categorías duplicaría la gráfica sin aportar. En esos casos el acceso por
 * teclado al mismo filtro lo da el selector de la barra de filtros.
 */
const MAX_CATEGORIAS_CON_LEYENDA = 8;

/** Caracteres por línea antes de pasar a la siguiente, en la etiqueta del eje de categorías. */
const MAX_CARACTERES_POR_LINEA = 30;
/** Líneas antes de recortar el resto con «…» (evita filas absurdamente altas). */
const MAX_LINEAS_ETIQUETA = 4;
/** Alto de línea, en píxeles, para el bloque de texto de la marca del eje. */
const ALTO_LINEA_ETIQUETA = 13;

/**
 * Reparte un texto en como mucho `MAX_LINEAS_ETIQUETA` líneas de hasta
 * `MAX_CARACTERES_POR_LINEA` caracteres. Si el texto no alcanza a caber
 * incluso así (un responsable compuesto por varios nombres largos), la
 * última línea se recorta con «…» — el texto íntegro sigue disponible en la
 * tabla debajo de la gráfica y en el tooltip de la barra.
 */
function envolverEtiqueta(texto: string): string[] {
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let actual = "";

  for (const palabra of palabras) {
    const candidata = actual ? `${actual} ${palabra}` : palabra;
    if (candidata.length <= MAX_CARACTERES_POR_LINEA || !actual) {
      actual = candidata;
    } else {
      lineas.push(actual);
      actual = palabra;
    }
  }
  if (actual) lineas.push(actual);

  if (lineas.length <= MAX_LINEAS_ETIQUETA) return lineas;

  const visibles = lineas.slice(0, MAX_LINEAS_ETIQUETA);
  visibles[MAX_LINEAS_ETIQUETA - 1] = `${visibles[MAX_LINEAS_ETIQUETA - 1]}…`;
  return visibles;
}

/**
 * Marca del eje de categorías en horizontal, repartida en varias líneas.
 *
 * El texto completo no cabe en una sola línea cuando hay categorías largas
 * (p. ej. el texto literal de «Responsable», que puede juntar varios nombres
 * separados por coma): en vez de recortarlo a una línea —que llegó a perder
 * nombres enteros de un responsable compuesto sin dejarlo notorio—, se
 * reparte en hasta tres líneas. `BarrasCategoria` usa la misma función para
 * darle a cada fila el alto que su etiqueta necesita.
 */
function MarcaCategoria({
  x = 0,
  y = 0,
  payload = { value: "" },
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  const lineas = envolverEtiqueta(payload.value);
  // Centra el bloque de N líneas respecto al centro vertical de la fila (`y`).
  const primeraLinea = -((lineas.length - 1) * ALTO_LINEA_ETIQUETA) / 2 + 4;
  return (
    <text x={x} y={y} textAnchor="end" fontSize={EJE.tick.fontSize} fill={EJE.tick.fill}>
      {lineas.map((linea, i) => (
        <tspan key={i} x={x} dy={i === 0 ? primeraLinea : ALTO_LINEA_ETIQUETA}>
          {linea}
        </tspan>
      ))}
    </text>
  );
}

interface BarrasCategoriaProps {
  data: BarraCategoria[];
  /** `horizontal`: barras hacia la derecha, adecuado para etiquetas largas (§8). */
  orientacion?: "vertical" | "horizontal";
  /** Clave seleccionada, o `null` si ninguna. */
  seleccionado?: string | null;
  onSelect?: (clave: string) => void;
  unidad?: string;
  /** Nombre del eje de valores (regla dashboard §2). */
  ejeValor?: string;
  /** Nombre de la magnitud en el tooltip. */
  serie?: string;
  altura?: number;
}

/**
 * Barras por categoría con clic-para-filtrar (regla dashboard §2–3, §9).
 *
 * Las barras se ordenan **de mayor a menor valor**: es lo que permite leer el
 * ranking sin comparar longitudes una a una. En horizontal, la mayor queda
 * arriba; en vertical, a la izquierda.
 *
 * La barra seleccionada se distingue por color, borde y opacidad del resto, que
 * permanece visible (§3, §8–9). Cuando hay pocas categorías se acompaña de una
 * leyenda de botones para poder filtrar con teclado (§11); con muchas, esa vía
 * la cubre el selector equivalente de la barra de filtros.
 */
export function BarrasCategoria({
  data,
  orientacion = "vertical",
  seleccionado,
  onSelect,
  unidad = "%",
  ejeValor,
  serie = "Avance promedio",
  altura,
}: BarrasCategoriaProps) {
  const esHorizontal = orientacion === "horizontal";

  // Memoizado: recrear el array en cada render haría que Recharts reiniciara la
  // animación de entrada con cada clic de selección.
  const barras = useMemo(() => [...data].sort((a, b) => b.valor - a.valor), [data]);

  // Todas las filas comparten el alto de la etiqueta más exigente: Recharts
  // reparte el alto total en partes iguales por categoría, así que no hay
  // forma de darle a una sola fila más espacio que a las demás.
  const maxLineas = Math.max(1, ...barras.map((barra) => envolverEtiqueta(barra.etiqueta).length));
  const altoFila = 42 + (maxLineas - 1) * ALTO_LINEA_ETIQUETA;
  const alto = altura ?? (esHorizontal ? Math.max(200, barras.length * altoFila + 48) : 264);

  const ejeCategoria = esHorizontal ? (
    <YAxis
      type="category"
      dataKey="etiqueta"
      tick={<MarcaCategoria />}
      axisLine={false}
      tickLine={false}
      width={225}
      interval={0}
    />
  ) : (
    <XAxis dataKey="etiqueta" tick={EJE.tick} axisLine={EJE.axisLine} tickLine={false} interval={0} />
  );

  const ejeNumerico = esHorizontal ? (
    <XAxis type="number" tick={EJE.tick} axisLine={EJE.axisLine} tickLine={false} unit={unidad} domain={[0, 100]} />
  ) : (
    <YAxis tick={EJE.tick} axisLine={false} tickLine={false} unit={unidad} width={46} domain={[0, 100]} />
  );

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={alto}>
        <BarChart
          data={barras}
          layout={esHorizontal ? "vertical" : "horizontal"}
          // Margen derecho holgado en horizontal: la etiqueta «100%» se dibuja
          // al final de la barra y no debe quedar cortada (regla dashboard §2).
          margin={{ top: 22, right: esHorizontal ? 54 : 30, bottom: 4, left: esHorizontal ? 0 : -8 }}
          barCategoryGap={esHorizontal ? "22%" : "34%"}
        >
          <CartesianGrid stroke={REJILLA.stroke} horizontal={!esHorizontal} vertical={esHorizontal} />
          {ejeCategoria}
          {ejeNumerico}
          <Tooltip
            cursor={TOOLTIP.cursor}
            contentStyle={TOOLTIP.contentStyle}
            labelStyle={TOOLTIP.labelStyle}
            itemStyle={TOOLTIP.itemStyle}
            formatter={(valor, _nombre, item) => {
              const detalle = (item as { payload?: BarraCategoria } | undefined)?.payload?.detalle;
              return [`${valor}${unidad}${detalle ? ` · ${detalle}` : ""}`, serie];
            }}
          />
          <Bar
            dataKey="valor"
            name={serie}
            radius={esHorizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]}
            isAnimationActive
            animationDuration={ANIMACION_MS}
            cursor={onSelect ? "pointer" : undefined}
            onClick={(entrada: { payload?: BarraCategoria }) => {
              const clave = entrada?.payload?.clave;
              if (clave) onSelect?.(clave);
            }}
          >
            {barras.map((barra) => {
              const activo = seleccionado === barra.clave;
              return (
                <Cell
                  key={barra.clave}
                  fill={activo ? "var(--uc-green-dark)" : "var(--uc-green)"}
                  opacity={!seleccionado || activo ? 1 : OPACIDAD_ATENUADA}
                  stroke={activo ? "var(--uc-gold)" : "none"}
                  strokeWidth={activo ? 2 : 0}
                />
              );
            })}
            <LabelList
              dataKey="valor"
              position={esHorizontal ? "right" : "top"}
              offset={8}
              formatter={(valor) => `${valor}${unidad}`}
              style={{ fill: "var(--uc-green-dark)", fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {ejeValor && <p className="chart-eje-nota">{ejeValor}</p>}

      {onSelect && barras.length <= MAX_CATEGORIAS_CON_LEYENDA && (
        // Sin muestra de color: todas las barras comparten un mismo tono —la
        // magnitud la da su longitud—, así que un cuadro cromático por categoría
        // insinuaría una codificación que la gráfica no hace.
        <LeyendaInteractiva
          items={barras.map((barra) => ({
            clave: barra.clave,
            label: barra.etiqueta,
            valor: `${barra.valor}${unidad}`,
          }))}
          seleccionado={seleccionado}
          onSelect={onSelect}
          descripcion="Filtrar por categoría"
        />
      )}
    </div>
  );
}
