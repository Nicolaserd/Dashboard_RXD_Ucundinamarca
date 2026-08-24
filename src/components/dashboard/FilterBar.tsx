"use client";

import type { ReactNode } from "react";

export interface FilterConfig {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  /** Contenido informativo opcional junto a la etiqueta (p. ej. la escala de estados). */
  ayuda?: ReactNode;
}

interface FilterBarProps {
  filters: FilterConfig[];
  /** Valor actual de cada filtro, indexado por `id`. Componente controlado. */
  valores: Record<string, string>;
  onChange: (filterId: string, value: string) => void;
  onClearAll: () => void;
}

/**
 * Barra de filtros de contexto del tablero (regla dashboard §6).
 *
 * Es un componente **controlado**: el estado vive en el contexto compartido
 * (`FiltrosProvider`), de modo que los filtros elegidos aquí y las selecciones
 * hechas sobre las gráficas son el mismo estado y no se duplican (§4).
 * Muestra los filtros activos como chips y permite limpiarlos uno a uno o todos.
 */
export function FilterBar({ filters, valores, onChange, onClearAll }: FilterBarProps) {
  const activos = filters.filter((filtro) => valores[filtro.id]);

  return (
    <div className="filters">
      <div className="filter-controls">
        {filters.map((filtro) => (
          <div key={filtro.id} className="filter-field">
            <label htmlFor={`filtro-${filtro.id}`}>{filtro.label}</label>
            {filtro.ayuda}
            <select
              id={`filtro-${filtro.id}`}
              className="filter-select"
              value={valores[filtro.id] ?? ""}
              onChange={(evento) => onChange(filtro.id, evento.target.value)}
            >
              <option value="">Todas</option>
              {filtro.options.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {activos.length > 0 && (
          <button type="button" className="filter-clear" onClick={onClearAll}>
            Limpiar filtros
          </button>
        )}
      </div>

      {activos.length > 0 && (
        <div>
          <div className="filter-active-label">Filtros activos:</div>
          <div className="filterbar">
            {activos.map((filtro) => {
              const valor = valores[filtro.id] ?? "";
              const etiqueta = filtro.options.find((o) => o.value === valor)?.label ?? valor;
              return (
                <button
                  key={filtro.id}
                  type="button"
                  className="filter-chip"
                  onClick={() => onChange(filtro.id, "")}
                  aria-label={`Quitar el filtro ${filtro.label}: ${etiqueta}`}
                >
                  {filtro.label}: <b>{etiqueta}</b>
                  <span aria-hidden="true">✕</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
