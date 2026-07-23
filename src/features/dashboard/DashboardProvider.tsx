"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Estado compartido del dashboard (regla dashboard §3–4):
 * - `selected`: categoría (sede) usada como filtro; una gráfica la fija y las
 *   demás reaccionan. La selección se refleja en toda la vista.
 * - tooltip flotante compartido para las gráficas.
 */
interface TooltipState {
  content: ReactNode;
  x: number;
  y: number;
}

interface DashboardCtx {
  selected: string | null;
  toggle: (name: string) => void;
  clear: () => void;
  showTip: (content: ReactNode, e: { clientX: number; clientY: number }) => void;
  hideTip: () => void;
}

const Ctx = createContext<DashboardCtx | null>(null);

export function useDashboard(): DashboardCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDashboard debe usarse dentro de <DashboardProvider>");
  return ctx;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [tip, setTip] = useState<TooltipState | null>(null);

  const toggle = useCallback(
    (name: string) => setSelected((s) => (s === name ? null : name)),
    [],
  );
  const clear = useCallback(() => setSelected(null), []);
  const showTip = useCallback(
    (content: ReactNode, e: { clientX: number; clientY: number }) =>
      setTip({ content, x: e.clientX, y: e.clientY }),
    [],
  );
  const hideTip = useCallback(() => setTip(null), []);

  return (
    <Ctx.Provider value={{ selected, toggle, clear, showTip, hideTip }}>
      {children}
      {tip && (
        <div
          className="chart-tooltip"
          role="status"
          style={{ left: tip.x + 14, top: tip.y - 10 }}
        >
          {tip.content}
        </div>
      )}
    </Ctx.Provider>
  );
}
