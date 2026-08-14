# ADR-0002 — Los temas del portal son los sistemas de gestión

**Estado:** Aceptada · 2026-08-13

## Contexto

La aplicación se construyó con una portada de «temas» y datos de demostración inventados
(deserción, bienestar, talento humano). Al incorporar los datos reales de [`data/`](../../data/) hubo
que decidir qué es un tema.

Los datos se organizan naturalmente en tres niveles: **sistema de gestión** → **vigencia del ciclo de
RXD** → **oportunidad de mejora**.

## Decisión

Un **tema = un sistema de gestión**. Los cinco libros producen los cinco temas del portal: SGC, SGA,
SG-SST, SGSI y SGAS.

La **vigencia** no es un tema sino una **dimensión de filtro** dentro del tablero, junto con el
estado de avance y el área responsable.

El registro [`src/features/temas/temas.ts`](../../src/features/temas/temas.ts) se **deriva del
dataset**: nombre, número de OM, rango de vigencias y último corte salen de los datos; solo el ícono
y la frase de alcance se declaran a mano. Un sistema sin OM cargadas queda como «Próximamente».

## Alternativas consideradas

- **Un tema por vigencia** (2022, 2023, 2024, 2025). Descartada: fragmenta el seguimiento de una
  misma OM, que vive a lo largo de varias vigencias, e impide leer el portafolio completo de un
  sistema.
- **Un único tema con todos los sistemas.** Descartada: cada sistema tiene responsables, auditorías
  y ciclos propios; mezclarlos en un solo tablero diluye la responsabilidad. Las cifras consolidadas
  se muestran en la portada, que es donde tienen sentido.

## Consecuencias

- Añadir un sistema es añadir su libro a `data/`, ejecutar `pnpm datos:importar` y registrar su
  presentación en `temas.ts`. No se toca la arquitectura (Abierto/Cerrado).
- Los `id` de tema cambiaron respecto a los datos de demostración (`sgc`, `sga`, `sgsst`, `sgsi`,
  `sgas`), y con ellos las rutas `/temas/:temaId/...`.
- Comparar sistemas entre sí exige salir a la portada; no hay una vista comparativa. Si se necesita,
  sería un tema consolidado adicional, no un cambio de arquitectura.
