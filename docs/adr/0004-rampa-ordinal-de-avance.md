# ADR-0004 — El avance se codifica con una rampa ordinal de un solo tono

**Estado:** Aceptada · 2026-08-14

## Contexto

El avance de una OM se mide en la escala institucional **0 · 0.5 · 1 · 1.5 · 2**,
donde 2 equivale al 100 % completado. Es una **magnitud ordenada**: cambiar el orden de
las categorías cambiaría el significado.

La primera implementación le asignó una **paleta categórica** de colores institucionales
distintos: verde, lima, verde claro, oro y gris. Al validarla con el script de la
metodología de visualización de datos, falló:

```
[FAIL] CVD separation       #91C256↔#79C000  ΔE 3.3 (protan)
[FAIL] Normal-vision floor  #91C256↔#79C000  ΔE 5.8  — por debajo de 15
```

Es decir: «Avance parcial» y «Avance significativo» eran indistinguibles **incluso con
visión de color completa**, no solo bajo daltonismo. El umbral de visión normal es una
puerta dura que el refuerzo no cromático no excusa.

## Decisión

Codificar el avance con una **rampa secuencial de un solo tono**, derivada del verde
institucional `#007B3E`, con luminosidad monótona de claro a oscuro:

| Calificación | Estado | Token | Valor |
|---:|---|---|---|
| 0 | Sin avance | `--uc-avance-0` | `#63C482` |
| 0.5 | Avance mínimo | `--uc-avance-1` | `#46A969` |
| 1 | Avance parcial | `--uc-avance-2` | `#288F51` |
| 1.5 | Avance significativo | `--uc-avance-3` | `#007B3E` *(oficial)* |
| 2 | Cumplida | `--uc-avance-4` | `#00482B` *(oficial)* |
| — | Sin seguimiento | `--uc-avance-nd` | `#999999` |

Los dos pasos oscuros son los tokens institucionales; los tres claros son aclarados del
mismo tono, con la **croma acotada a la del propio verde** para no producir verdes neón,
que la regla visual §1.7 prohíbe. «Sin seguimiento» queda **fuera** de la rampa, en gris
neutro: no es un valor bajo de la escala, es la ausencia de medición.

Verificación (`--ordinal`): monotonía de L · ΔL ≥ 0.06 · contraste del extremo claro
2.10:1 · tono único → **todas las comprobaciones pasan**.

Consecuencia asociada: el color viste la **marca**, nunca el texto. Los pasos claros de
la rampa no alcanzan contraste de texto legible, así que el distintivo de estado
(`EstadoTag`) lleva un punto de color, un símbolo cuyo relleno crece con el avance
(`○ ◔ ◑ ◕ ●`) y la etiqueta en tinta.

## Alternativas consideradas

- **Conservar la paleta categórica y añadir símbolos.** Descartada: el refuerzo no
  cromático rescata un ΔE en la banda 6–8, pero no un fallo del umbral de visión normal.
  Además, una paleta categórica codifica *identidad*, y aquí el dato es *magnitud*.
- **Re-escalonar solo el par que falla** dentro de los colores oficiales. Descartada:
  la paleta institucional no tiene suficientes verdes separados para cinco pasos, y
  mezclar oro y gris en la escala la convertía en un arcoíris para una magnitud.
- **Una rampa de máxima croma.** Descartada: produce verdes neón (`#3DFE8F`),
  expresamente prohibidos.

## Consecuencias

- La escala se lee como lo que es: más oscuro = más avance, sin necesidad de leyenda
  para captar el orden.
- Los verdes dominan la interfaz, como exige la regla visual §1.5.
- Se añaden seis tokens a `globals.css`. **No son colores de marca** y así están
  documentados: son pasos de una rampa de visualización derivada del verde oficial.
- Cambiar la escala obliga a re-validar con el script antes de fusionar.

> **Actualización — 2026-08-24.** «Sin seguimiento» dejó de ser un estado de OM: una OM sin
> ninguna calificación cuenta ahora como **Sin avance** (ver [datos.md §4](../datos.md#estado-vigente-de-una-om)).
> El token `--uc-avance-nd` no queda huérfano — sigue en uso para un concepto más acotado: la
> observación de un corte puntual sin calificación numérica (`colorClasificacion`/`simboloClasificacion`
> en `src/lib/om/avance.ts`), que es distinto del estado vigente de la OM. La rampa de 5 pasos de
> esta ADR no cambia; solo se retira el paso «fuera de la rampa» de la escala de **estados**.
