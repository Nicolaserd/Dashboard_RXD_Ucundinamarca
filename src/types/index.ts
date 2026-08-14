/** Tipos de dominio compartidos. */

export type EstadoTema = "disponible" | "proximamente";

export interface Tema {
  /**
   * Identificador del sistema. Da también la ruta (`/temas/<id>/…`) y el nombre
   * del logotipo en `/public/brand/sistemas/<id>.png`.
   */
  id: string;
  name: string;
  desc: string;
  estado: EstadoTema;
  upd: string;
  /** Cifra de contexto de la tarjeta («SGC · 76 OM · vigencias 2022–2025»). */
  detalle?: string;
}

/* ============================================================
   Seguimiento a Oportunidades de Mejora (OM) de la Revisión
   por la Dirección (RXD). Origen: `data/*.xlsx` → `src/data/om-rxd.json`
   (ver `scripts/importar-om-rxd.mjs`).
   ============================================================ */

/**
 * Escala institucional de clasificación del avance de una OM, tal como la
 * registran los libros de seguimiento: de 0 (sin avance) a 2 (cumplida).
 */
export type Clasificacion = 0 | 0.5 | 1 | 1.5 | 2;

/** Estado derivado de la última clasificación registrada para una OM. */
export type EstadoAvance =
  | "sin-seguimiento"
  | "sin-avance"
  | "avance-minimo"
  | "avance-parcial"
  | "avance-significativo"
  | "cumplida";

/** Un corte de seguimiento sobre una OM: quién evaluó, cuándo y con qué avance. */
export interface SeguimientoOM {
  /** Fecha de corte en formato ISO (`AAAA-MM-DD`). Siempre presente. */
  corte: string;
  /** Fecha de corte tal como aparece en el libro de origen. */
  corteTexto: string;
  funcionario: string;
  observacion: string;
  /** `null` cuando el corte registra observación pero no califica el avance. */
  clasificacion: Clasificacion | null;
}

/** Una Oportunidad de Mejora con todo su historial de seguimiento. */
export interface OportunidadMejora {
  id: string;
  /** Año del ciclo de RXD que originó la OM. */
  vigencia: string;
  /** Consecutivo «PM N°»; `null` cuando el libro de origen no lo registra. */
  numero: number | null;
  /** Fecha de entrega comprometida en ISO, o `null` si el texto no es una fecha. */
  fechaEntrega: string | null;
  /** Compromiso de entrega tal como se redactó («Inmediato», «IPA 2025»…). */
  fechaEntregaTexto: string;
  responsable: string;
  /** Áreas institucionales canónicas mencionadas en `responsable`. */
  areas: string[];
  oportunidad: string;
  entregable: string;
  /** Cortes ordenados cronológicamente. */
  seguimientos: SeguimientoOM[];
}

/** Un sistema de gestión certificable y sus OM. */
export interface SistemaGestion {
  id: string;
  sigla: string;
  nombre: string;
  /** Libro de origen dentro de `data/`. */
  archivo: string;
  oms: OportunidadMejora[];
}
