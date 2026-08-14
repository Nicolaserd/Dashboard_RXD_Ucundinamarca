"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { EstadoAvance } from "@/types";
import { colorEstado, etiquetaEstado } from "@/lib/om/avance";
import { ANIMACION_MS, EJE, REJILLA, TOOLTIP } from "@/components/charts/estilos";

interface BarrasEstadoPorSistemaProps {
  /** Una fila por sistema: `{ sistema, total, [estado]: nº de OM }`. */
  data: Array<Record<string, string | number>>;
  /** Estados a apilar, en el orden de la escala de avance. */
  estados: EstadoAvance[];
}

/**
 * Composición por estado de avance de cada sistema, en barras apiladas
 * horizontales (regla dashboard §1–2, §10).
 *
 * Apiladas y no agrupadas porque la pregunta es «de qué se compone el
 * portafolio de cada sistema»: el largo total es su número de OM y los
 * segmentos, su reparto. Los segmentos se separan con un hilo del color de la
 * superficie en lugar de dibujarles un borde.
 *
 * La leyenda la aporta la vista con `LeyendaInteractiva`, común a las demás
 * gráficas del tablero.
 */
export function BarrasEstadoPorSistema({ data, estados }: BarrasEstadoPorSistemaProps) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 52 + 48)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 12, right: 28, bottom: 4, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid stroke={REJILLA.stroke} horizontal={false} />
          <XAxis
            type="number"
            tick={EJE.tick}
            axisLine={EJE.axisLine}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="sistema"
            tick={EJE.tick}
            axisLine={false}
            tickLine={false}
            width={72}
            interval={0}
          />
          <Tooltip
            cursor={TOOLTIP.cursor}
            contentStyle={TOOLTIP.contentStyle}
            labelStyle={TOOLTIP.labelStyle}
            itemStyle={TOOLTIP.itemStyle}
            formatter={(valor, nombre) => [
              `${valor} OM`,
              etiquetaEstado(nombre as EstadoAvance),
            ]}
          />
          {estados.map((estado) => (
            <Bar
              key={estado}
              dataKey={estado}
              name={estado}
              stackId="estado"
              fill={colorEstado(estado)}
              // Hilo del color de la superficie: separa los segmentos apilados
              // sin rodearlos de un borde.
              stroke="var(--uc-surface)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={ANIMACION_MS}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
