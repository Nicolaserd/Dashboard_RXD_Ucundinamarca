"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ReferenceLine,
} from "recharts";
import { ANIMACION_MS, EJE, REJILLA, TOOLTIP } from "./estilos";

export interface PuntoTendencia {
  /** Etiqueta del eje X, ya formateada. */
  etiqueta: string;
  valor: number;
  /** Tamaño de la población que sustenta el punto, para declararlo en el tooltip. */
  base?: number;
}

interface TrendLineChartProps {
  data: PuntoTendencia[];
  /** Nombre de la serie, usado en el tooltip. */
  serie?: string;
  unidad?: string;
  /** Nombre del eje Y (regla dashboard §2: «los ejes deben incluir nombres claros»). */
  ejeY?: string;
  /** Sustantivo de la base del punto: «OM evaluadas», «registros»… */
  baseLabel?: string;
  /** Línea de referencia horizontal, p. ej. una meta institucional. */
  meta?: { valor: number; label: string };
}

/**
 * Evolución temporal con etiquetas de valor, tooltip y línea de meta
 * (regla dashboard §1–2, §9).
 *
 * Los puntos de una tendencia no actúan como filtro: no existe una relación
 * lógica entre «corte de seguimiento» y las dimensiones del tablero (vigencia,
 * estado y área), y la regla §3 solo exige la interacción cuando esa relación
 * existe. La gráfica sí responde a los filtros generales, que recalculan la serie.
 */
export function TrendLineChart({
  data,
  serie = "Valor",
  unidad = "%",
  ejeY,
  baseLabel = "registros",
  meta,
}: TrendLineChartProps) {
  // Índices con etiqueta directa: primero, último, máximo y mínimo.
  const destacados = new Set<number>();
  if (data.length > 0) {
    let iMax = 0;
    let iMin = 0;
    data.forEach((punto, i) => {
      if (punto.valor > (data[iMax]?.valor ?? 0)) iMax = i;
      if (punto.valor < (data[iMin]?.valor ?? 0)) iMin = i;
    });
    destacados.add(0).add(data.length - 1).add(iMax).add(iMin);
  }

  return (
    // `chart-linea` permite ocultar las etiquetas de valor en pantallas
    // estrechas, donde se solaparían; el tooltip conserva el dato, que es la
    // alternativa que admite la regla dashboard §2.
    <div className="chart-wrap chart-linea">
      <ResponsiveContainer width="100%" height={264}>
        <LineChart data={data} margin={{ top: 26, right: 18, bottom: 4, left: ejeY ? 4 : -8 }}>
          <CartesianGrid stroke={REJILLA.stroke} vertical={false} />
          <XAxis
            dataKey="etiqueta"
            tick={EJE.tick}
            axisLine={EJE.axisLine}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis
            tick={EJE.tick}
            axisLine={false}
            tickLine={false}
            unit={unidad}
            width={ejeY ? 62 : 46}
            domain={[0, 100]}
            label={
              ejeY
                ? { value: ejeY, angle: -90, position: "insideLeft", style: { ...EJE.tick, textAnchor: "middle" } }
                : undefined
            }
          />
          <Tooltip
            contentStyle={TOOLTIP.contentStyle}
            labelStyle={TOOLTIP.labelStyle}
            itemStyle={TOOLTIP.itemStyle}
            formatter={(valor, _nombre, item) => {
              const base = (item as { payload?: PuntoTendencia } | undefined)?.payload?.base;
              return [`${valor}${unidad}${base ? ` · ${base} ${baseLabel}` : ""}`, serie];
            }}
          />
          {meta && (
            <ReferenceLine
              y={meta.valor}
              stroke="var(--uc-gold)"
              strokeDasharray="5 4"
              label={{
                value: meta.label,
                position: "insideTopRight",
                style: { fill: "var(--uc-gold)", fontSize: 11, fontWeight: 600 },
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="valor"
            name={serie}
            stroke="var(--uc-green)"
            strokeWidth={2.5}
            isAnimationActive
            animationDuration={ANIMACION_MS}
            dot={{ r: 3.5, fill: "var(--uc-green)", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "var(--uc-green-dark)" }}
          >
            <LabelList
              dataKey="valor"
              position="top"
              offset={10}
              // Solo se rotulan los puntos que cuentan la historia (extremos de
              // la serie, máximo y mínimo). Un número sobre cada punto satura la
              // gráfica y no se lee; el resto de valores los dan el eje, el
              // tooltip y la vista Datos.
              content={(props) => {
                const { index, x, y, value } = props as {
                  index?: number;
                  x?: number | string;
                  y?: number | string;
                  value?: number;
                };
                if (index === undefined || !destacados.has(index) || value == null) return null;
                return (
                  <text
                    x={Number(x)}
                    y={Number(y) - 10}
                    textAnchor="middle"
                    style={{ fill: "var(--uc-green-dark)", fontSize: 11, fontWeight: 600 }}
                  >
                    {value}
                    {unidad}
                  </text>
                );
              }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
