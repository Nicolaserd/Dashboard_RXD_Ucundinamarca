"use client";

import { useState } from "react";

export interface FilterConfig {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}

interface FilterBarProps {
  filters: FilterConfig[];
  onFilterChange?: (filterId: string, value: string) => void;
  onClearAll?: () => void;
}

/** Estado inicial: cada filtro en su valor por defecto (o «Todos»). */
function valoresIniciales(filters: FilterConfig[]): Record<string, string> {
  return Object.fromEntries(filters.map((f) => [f.id, f.defaultValue ?? ""]));
}

/**
 * Barra de filtros reutilizable para dashboards (regla dashboard §6).
 *
 * Muestra un selector por filtro, los filtros activos como chips y la acción
 * «Limpiar filtros». Los filtros compartidos entre vistas viven en `filtros.ts`.
 */
export function FilterBar({ filters, onFilterChange, onClearAll }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = useState(() => valoresIniciales(filters));

  const handleChange = (filterId: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [filterId]: value }));
    onFilterChange?.(filterId, value);
  };

  const handleClear = () => {
    const defaults = valoresIniciales(filters);
    setSelectedFilters(defaults);
    filters.forEach((f) => onFilterChange?.(f.id, defaults[f.id] ?? ""));
    onClearAll?.();
  };

  const activeFilters = filters.filter((f) => selectedFilters[f.id]);

  return (
    <div className="filters">
      <div className="filter-controls">
        {filters.map((filter) => (
          <div key={filter.id} className="filter-field">
            <label htmlFor={`filtro-${filter.id}`}>{filter.label}</label>
            <select
              id={`filtro-${filter.id}`}
              className="filter-select"
              value={selectedFilters[filter.id] ?? ""}
              onChange={(e) => handleChange(filter.id, e.target.value)}
            >
              <option value="">Todos</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {activeFilters.length > 0 && (
          <button type="button" className="filter-clear" onClick={handleClear}>
            Limpiar filtros
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div>
          <div className="filter-active-label">Filtros activos:</div>
          <div className="filterbar">
            {activeFilters.map((filter) => {
              const value = selectedFilters[filter.id];
              const label = filter.options.find((o) => o.value === value)?.label ?? value;
              return (
                <div key={filter.id} className="filter-chip">
                  {filter.label}: <b>{label}</b>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
