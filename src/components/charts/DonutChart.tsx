"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface Segmento {
  name: string;
  value: number;
}

/** Paleta institucional cíclica — nunca HEX suelto (regla visual §1.7). */
const PALETA = [
  "var(--uc-green)",
  "var(--uc-gold)",
  "var(--uc-turquoise)",
  "var(--uc-orange)",
  "var(--uc-green-light)",
  "var(--uc-lime)",
];

interface EtiquetaProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  percent?: number;
}

/** Etiqueta de porcentaje fuera del segmento, con color institucional (regla dashboard §2). */
function renderEtiqueta({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0 }: EtiquetaProps) {
  const RADIO_EXTRA = 18;
  const radio = outerRadius + RADIO_EXTRA;
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
      {Math.round(percent * 100)}%
    </text>
  );
}

interface DonutChartProps {
  data: Segmento[];
  /** Nombre del segmento seleccionado, o `null` si ninguno. */
  seleccionado?: string | null;
  onSelect?: (name: string | null) => void;
}

/**
 * Composición porcentual con clic-para-filtrar (regla dashboard §3, §9).
 * El segmento seleccionado se resalta con borde + opacidad de los demás,
 * nunca solo con color (regla dashboard §8–9).
 */
export function DonutChart({ data, seleccionado, onSelect }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={54}
          outerRadius={82}
          paddingAngle={2}
          isAnimationActive
          animationDuration={700}
          cursor={onSelect ? "pointer" : undefined}
          label={renderEtiqueta}
          labelLine={{ stroke: "var(--uc-hairline-strong)" }}
          onClick={(entry: { name?: string }) => {
            if (!entry.name) return;
            onSelect?.(seleccionado === entry.name ? null : entry.name);
          }}
        >
          {data.map((seg, i) => (
            <Cell
              key={seg.name}
              fill={PALETA[i % PALETA.length]}
              opacity={!seleccionado || seleccionado === seg.name ? 1 : 0.35}
              stroke={seleccionado === seg.name ? "var(--uc-green-dark)" : "none"}
              strokeWidth={seleccionado === seg.name ? 2 : 0}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}%`, `${name}`]}
          contentStyle={{
            background: "var(--uc-green-dark)",
            border: "none",
            borderRadius: 9,
            color: "#fff",
            fontSize: 12,
            padding: "8px 11px",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          formatter={(value: string) => {
            const seg = data.find((s) => s.name === value);
            return (
              <span className="legend-label">
                {value} <b>{seg?.value}%</b>
              </span>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
