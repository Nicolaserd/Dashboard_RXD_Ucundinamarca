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

/**
 * Barra de filtros reutilizable para dashboards.
 * Permite filtrar por período, sede, categoría, etc.
 */
export function FilterBar({ filters, onFilterChange, onClearAll }: FilterBarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    Object.fromEntries(filters.map((f) => [f.id, f.defaultValue || ""]))
  );

  const handleChange = (filterId: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [filterId]: value }));
    onFilterChange?.(filterId, value);
  };

  const handleClear = () => {
    const cleared = Object.fromEntries(filters.map((f) => [f.id, f.defaultValue || ""]));
    setSelectedFilters(cleared);
    onClearAll?.();
  };

  const activeFilters = Object.entries(selectedFilters).filter(([_, v]) => v);

  return (
    <>
      {/* Barra de filtros */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        {filters.map((filter) => (
          <div key={filter.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "13px", fontWeight: 500, color: "#666", minWidth: "80px" }}>
              {filter.label}
            </label>
            <select
              value={selectedFilters[filter.id] || ""}
              onChange={(e) => handleChange(filter.id, e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d9ddd9",
                fontSize: "13px",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
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
          <button
            onClick={handleClear}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #d9ddd9",
              background: "#f7f7f5",
              color: "#666",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Mostrar filtros activos */}
      {activeFilters.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>Filtros activos:</div>
          <div className="filterbar">
            {activeFilters.map(([filterId, value]) => {
              const filter = filters.find((f) => f.id === filterId);
              const label = filter?.options.find((o) => o.value === value)?.label || value;
              return (
                <div key={filterId} className="filter-chip">
                  {filter?.label}: <b>{label}</b>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
