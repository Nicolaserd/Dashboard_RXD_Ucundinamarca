"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ANIMACION_MS, OPACIDAD_ATENUADA, TOOLTIP } from "./estilos";

export interface Segmento {
  /** Valor que se envía al filtro al seleccionar el segmento. */
  clave: string;
  name: string;
  value: number;
  /** Color institucional de la categoría (§10: mismo color en todo el tablero). */
  color: string;
}

interface EtiquetaProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
  value?: number;
}

/** Etiqueta exterior con conteo y porcentaje (regla dashboard §2). */
function renderEtiqueta({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  percent = 0,
  value = 0,
}: EtiquetaProps) {
  const radio = outerRadius + 18;
  const rad = (-midAngle * Math.PI) / 180;
  const x = cx + radio * Math.cos(rad);
  const y = cy + radio * Math.sin(rad);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="donut-label"
    >
      {value} · {Math.round(percent * 100)}%
    </text>
  );
}

interface DonutChartProps {
  data: Segmento[];
  /** Clave del segmento seleccionado, o `null` si ninguno. */
  seleccionado?: string | null;
  onSelect?: (clave: string) => void;
  /** Cifra que se muestra en el centro del anillo. */
  centro?: { valor: string; etiqueta: string };
}

/**
 * Composición por categoría con clic-para-filtrar (regla dashboard §3, §9).
 *
 * El segmento seleccionado se resalta con borde y desplazamiento, y los demás
 * bajan de opacidad sin desaparecer: la selección nunca depende solo del color
 * (§8–9). La leyenda accesible por teclado la aporta `LeyendaInteractiva`.
 */
export function DonutChart({ data, seleccionado, onSelect, centro }: DonutChartProps) {
  const total = data.reduce((suma, segmento) => suma + segmento.value, 0);

  return (
    <div className="chart-wrap donut-wrap">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={86}
            paddingAngle={2}
            isAnimationActive
            animationDuration={ANIMACION_MS}
            cursor={onSelect ? "pointer" : undefined}
            label={renderEtiqueta}
            labelLine={{ stroke: "var(--uc-hairline-strong)" }}
            onClick={(entrada: { payload?: Segmento }) => {
              const clave = entrada?.payload?.clave;
              if (clave) onSelect?.(clave);
            }}
          >
            {data.map((segmento) => {
              const activo = seleccionado === segmento.clave;
              return (
                <Cell
                  key={segmento.clave}
                  fill={segmento.color}
                  opacity={!seleccionado || activo ? 1 : OPACIDAD_ATENUADA}
                  // Separación de 2 px del color de superficie: separa los
                  // segmentos sin dibujarles un borde alrededor.
                  stroke={activo ? "var(--uc-green-dark)" : "var(--uc-surface)"}
                  strokeWidth={activo ? 3 : 2}
                />
              );
            })}
          </Pie>
          <Tooltip
            formatter={(valor, nombre) => {
              const cantidad = Number(valor) || 0;
              return [
                `${cantidad} OM · ${total > 0 ? Math.round((cantidad / total) * 100) : 0}%`,
                nombre,
              ];
            }}
            contentStyle={TOOLTIP.contentStyle}
            labelStyle={TOOLTIP.labelStyle}
            itemStyle={TOOLTIP.itemStyle}
          />
        </PieChart>
      </ResponsiveContainer>

      {centro && (
        <div className="donut-centro" aria-hidden="true">
          <b>{centro.valor}</b>
          <span>{centro.etiqueta}</span>
        </div>
      )}
    </div>
  );
}
