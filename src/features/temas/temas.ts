import type { Tema } from "@/types";
import { SISTEMAS, ultimoCorte } from "@/lib/om/dataset";
import { formatearFecha } from "@/lib/om/avance";

/**
 * Registro (registry) de temas del portal.
 *
 * Cada tema es un sistema de gestión con seguimiento a sus Oportunidades de
 * Mejora. La lista se deriva del dataset, así que incorporar un nuevo sistema
 * es añadir su libro a `data/`, ejecutar `pnpm datos:importar` y registrar aquí
 * su presentación — sin tocar la arquitectura (Abierto/Cerrado, CLAUDE.md §6).
 */

/**
 * Alcance de cada sistema. La clave es el `id` del dataset, que es también el
 * nombre de su logotipo en `/public/brand/sistemas/<id>.png`.
 */
const PRESENTACION: Record<string, string> = {
  sgc: "Mejora continua de procesos, documentación, contratación y servicio al ciudadano.",
  sga: "Desempeño ambiental, recursos e integración del componente ambiental en los procesos.",
  sgsst: "Condiciones de trabajo, riesgos, personal especializado y recursos para seguridad y salud.",
  sgsi: "Protección de la información, controles, tratamiento de datos y continuidad del servicio.",
  sgas: "Prevención del soborno, matriz de riesgos, debida diligencia y canales de denuncia.",
};

const RESPALDO = "Seguimiento a oportunidades de mejora.";

export const TEMAS: Tema[] = SISTEMAS.map((sistema) => {
  const vigencias = [...new Set(sistema.oms.map((om) => om.vigencia))].sort();
  const rango =
    vigencias.length > 1
      ? `${vigencias[0]}–${vigencias[vigencias.length - 1]}`
      : (vigencias[0] ?? "sin vigencias");

  return {
    id: sistema.id,
    name: sistema.nombre,
    desc: PRESENTACION[sistema.id] ?? RESPALDO,
    // Un sistema sin OM cargadas no tiene tablero que mostrar.
    estado: sistema.oms.length > 0 ? "disponible" : "proximamente",
    upd: `Último corte · ${formatearFecha(ultimoCorte(sistema.oms))}`,
    detalle: `${sistema.sigla} · ${sistema.oms.length} OM · vigencias ${rango}`,
  };
});

export function getTema(id: string): Tema | undefined {
  return TEMAS.find((tema) => tema.id === id);
}
