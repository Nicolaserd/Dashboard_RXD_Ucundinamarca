export interface DashboardData {
  kpis: Array<{
    label: string;
    value: string;
    delta: { label: string; type: "up" | "down-good" | "caution" };
  }>;
  chart: {
    xLabels: [string, string];
  };
  categories: Array<{ name: string; value: number }>;
  updates: Array<{ title: string; date: string }>;
  variations: Array<{ label: string; value: number; type: "up" | "down" }>;
  indicadores: Array<{ name: string; valor: string; meta: string; estado: "ok" | "caution" | "alert" }>;
  reportes: Array<{ titulo: string; fecha: string; descarga: string }>;
  datos: Array<{ periodo: string; total: number; porcentaje: number }>;
}

const TEMAS_DATA: Record<string, DashboardData> = {
  "desercion-permanencia": {
    kpis: [
      {
        label: "Tasa de deserción",
        value: "8.2%",
        delta: { label: "-0.5% vs 2025-IV", type: "down-good" },
      },
      {
        label: "Estudiantes en riesgo",
        value: "342",
        delta: { label: "-12 vs periodo anterior", type: "down-good" },
      },
      {
        label: "Tasa de retención",
        value: "91.8%",
        delta: { label: "+0.5% vs 2025-IV", type: "up" },
      },
      {
        label: "Estudiantes activos",
        value: "4,156",
        delta: { label: "+87 nuevos", type: "up" },
      },
    ],
    chart: {
      xLabels: ["2025-IV", "2026-I"],
    },
    categories: [
      { name: "Razones académicas", value: 45 },
      { name: "Razones económicas", value: 35 },
      { name: "Razones personales", value: 20 },
    ],
    updates: [
      { title: "Análisis trimestral completado", date: "24 de julio, 2026" },
      { title: "Seguimiento a estudiantes en riesgo", date: "22 de julio, 2026" },
      { title: "Nuevos datos de inscripción", date: "20 de julio, 2026" },
    ],
    variations: [
      { label: "Deserción total", value: -0.5, type: "down" },
      { label: "Retención efectiva", value: 0.5, type: "up" },
      { label: "Estudiantes nuevos", value: 2.1, type: "up" },
    ],
    indicadores: [
      { name: "Tasa de deserción por sede", valor: "Varía de 6.8% a 9.4%", meta: "<10%", estado: "ok" },
      { name: "Estudiantes en seguimiento", valor: "87 en programa", meta: ">80", estado: "ok" },
      { name: "Efectividad de interventorías", valor: "62% mejora académica", meta: ">70%", estado: "caution" },
    ],
    reportes: [
      { titulo: "Informe de Deserción 2026-I", fecha: "24 jul 2026", descarga: "PDF" },
      { titulo: "Análisis de Permanencia Estudiantil", fecha: "15 jul 2026", descarga: "XLSX" },
      { titulo: "Seguimiento Trimestral", fecha: "30 jun 2026", descarga: "PDF" },
    ],
    datos: [
      { periodo: "2025-IV", total: 4069, porcentaje: 8.7 },
      { periodo: "2025-III", total: 4156, porcentaje: 8.1 },
      { periodo: "2025-II", total: 4203, porcentaje: 7.9 },
      { periodo: "2025-I", total: 4287, porcentaje: 7.5 },
    ],
  },

  "bienestar-satisfaccion": {
    kpis: [
      {
        label: "Satisfacción general",
        value: "4.2/5",
        delta: { label: "+0.3 vs 2025-IV", type: "up" },
      },
      {
        label: "Encuestas respondidas",
        value: "1,247",
        delta: { label: "30% de cobertura", type: "ok" },
      },
      {
        label: "Servicios de bienestar activos",
        value: "14",
        delta: { label: "+2 vs año anterior", type: "up" },
      },
      {
        label: "Estudiantes atendidos",
        value: "892",
        delta: { label: "+154 este periodo", type: "up" },
      },
    ],
    chart: {
      xLabels: ["2025-IV", "2026-I"],
    },
    categories: [
      { name: "Servicios psicosociales", value: 28 },
      { name: "Servicios médicos", value: 22 },
      { name: "Actividades culturales", value: 25 },
      { name: "Programas deportivos", value: 25 },
    ],
    updates: [
      { title: "Encuesta de satisfacción completada", date: "24 de julio, 2026" },
      { title: "Lanzamiento de programa de mentorías", date: "18 de julio, 2026" },
      { title: "Ampliación de horarios de atención", date: "10 de julio, 2026" },
    ],
    variations: [
      { label: "Satisfacción con servicios", value: 7.1, type: "up" },
      { label: "Utilización de programas", value: 18.3, type: "up" },
      { label: "Quejas registradas", value: -12.5, type: "down" },
    ],
    indicadores: [
      { name: "Cobertura de servicios", valor: "67% estudiantes", meta: ">70%", estado: "caution" },
      { name: "Tiempo promedio de atención", valor: "4.2 días", meta: "<5 días", estado: "ok" },
      { name: "Resolución de casos", valor: "89%", meta: ">85%", estado: "ok" },
    ],
    reportes: [
      { titulo: "Informe de Satisfacción 2026-I", fecha: "24 jul 2026", descarga: "PDF" },
      { titulo: "Diagnóstico de Bienestar", fecha: "20 jul 2026", descarga: "XLSX" },
      { titulo: "Evaluación de Programas", fecha: "15 jul 2026", descarga: "PDF" },
    ],
    datos: [
      { periodo: "2026-I", total: 1247, porcentaje: 30 },
      { periodo: "2025-IV", total: 1089, porcentaje: 26 },
      { periodo: "2025-III", total: 945, porcentaje: 23 },
      { periodo: "2025-II", total: 876, porcentaje: 21 },
    ],
  },

  "talento-humano": {
    kpis: [
      {
        label: "Planta docente",
        value: "487",
        delta: { label: "+8 nuevos contratados", type: "up" },
      },
      {
        label: "Personal administrativo",
        value: "312",
        delta: { label: "-2 cambios", type: "caution" },
      },
      {
        label: "Docentes con postgrado",
        value: "68%",
        delta: { label: "+5% vs 2025", type: "up" },
      },
      {
        label: "Rotación anual",
        value: "5.2%",
        delta: { label: "-1.8% vs 2025", type: "down-good" },
      },
    ],
    chart: {
      xLabels: ["2025", "2026"],
    },
    categories: [
      { name: "Docentes de planta", value: 42 },
      { name: "Docentes hora cátedra", value: 38 },
      { name: "Docentes investigadores", value: 20 },
    ],
    updates: [
      { title: "Evaluación de desempeño completada", date: "22 de julio, 2026" },
      { title: "Programa de capacitación iniciado", date: "15 de julio, 2026" },
      { title: "Convocatoria de docentes investigadores", date: "10 de julio, 2026" },
    ],
    variations: [
      { label: "Docentes con posgrado", value: 5.0, type: "up" },
      { label: "Salarios competitivos", value: 3.2, type: "up" },
      { label: "Rotación de personal", value: -1.8, type: "down" },
    ],
    indicadores: [
      { name: "Índice de satisfacción laboral", valor: "7.8/10", meta: ">8.0", estado: "caution" },
      { name: "Docentes con capacitación", valor: "234 (48%)", meta: ">60%", estado: "caution" },
      { name: "Tasa de retención", valor: "94.8%", meta: ">95%", estado: "ok" },
    ],
    reportes: [
      { titulo: "Informe de Gestión de TH 2026", fecha: "22 jul 2026", descarga: "PDF" },
      { titulo: "Nómina y Beneficios", fecha: "20 jul 2026", descarga: "XLSX" },
      { titulo: "Evaluación de Desempeño", fecha: "18 jul 2026", descarga: "PDF" },
    ],
    datos: [
      { periodo: "2026", total: 799, porcentaje: 100 },
      { periodo: "2025", total: 783, porcentaje: 98 },
      { periodo: "2024", total: 756, porcentaje: 95 },
      { periodo: "2023", total: 731, porcentaje: 92 },
    ],
  },
};

export function getDashboardData(temaId: string): DashboardData {
  return (
    TEMAS_DATA[temaId] || {
      kpis: [],
      chart: { xLabels: ["", ""] },
      categories: [],
      updates: [],
      variations: [],
      indicadores: [],
      reportes: [],
      datos: [],
    }
  );
}
