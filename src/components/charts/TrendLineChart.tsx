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
} from "recharts";

export interface PuntoTendencia {
  periodo: string;
  valor: number;
}

interface TrendLineChartProps {
  data: PuntoTendencia[];
  /** Periodo a resaltar (p. ej. el filtro de período activo). */
  destacado?: string;
  unidad?: string;
}

/**
 * Gráfica de línea con animación de entrada, tooltip y punto resaltado
 * según el filtro de período activo (regla dashboard §2–3, §9).
 */
export function TrendLineChart({ data, destacado, unidad = "%" }: TrendLineChartProps) {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 24, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="var(--uc-hairline)" strokeDasharray="2 5" vertical={false} />
          <XAxis
            dataKey="periodo"
            tick={{ fontSize: 11, fill: "var(--uc-text-secondary)" }}
            axisLine={{ stroke: "var(--uc-hairline-strong)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--uc-text-secondary)" }}
            axisLine={false}
            tickLine={false}
            unit={unidad}
            width={44}
          />
          <Tooltip
            contentStyle={{
              background: "var(--uc-green-dark)",
              border: "none",
              borderRadius: 9,
              color: "#fff",
              fontSize: 12,
              padding: "8px 11px",
            }}
            labelStyle={{ color: "#fff", fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`${value}${unidad}`, "Valor"]}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="var(--uc-green)"
            strokeWidth={2}
            isAnimationActive
            animationDuration={700}
            dot={{ r: 3, fill: "var(--uc-green)", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "var(--uc-green-dark)" }}
          >
            <LabelList
              dataKey="valor"
              position="top"
              offset={10}
              formatter={(value) => `${value}${unidad}`}
              style={{ fill: "var(--uc-green-dark)", fontSize: 11, fontWeight: 600 }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
      {destacado && (
        <p className="chart-highlight">
          Período activo: <b>{destacado}</b>
        </p>
      )}
    </div>
  );
}
