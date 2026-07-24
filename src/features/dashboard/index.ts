/**
 * NOTA: Los componentes de vistas (ResumenView, IndicadoresView, etc.) han sido
 * movidos a sus respectivas carpetas `_components/` dentro del App Router:
 * - src/app/temas/[temaId]/resumen/_components/ResumenView.tsx
 * - src/app/temas/[temaId]/indicadores/_components/IndicadoresView.tsx
 * - src/app/temas/[temaId]/reportes/_components/ReportesView.tsx
 * - src/app/temas/[temaId]/datos/_components/DatosView.tsx
 * - src/app/temas/[temaId]/seguimiento/_components/SeguimientoView.tsx
 *
 * Solo dashboardData.ts permanece aquí porque es COMPARTIDO por todas las vistas.
 * Los archivos antiguos (ResumenView.tsx, IndicadoresView.tsx, OtrasVistas.tsx)
 * pueden ser eliminados de features/dashboard/.
 */

export { getDashboardData } from "./dashboardData";
export type { DashboardData } from "./dashboardData";
