# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Idioma:** este proyecto se trabaja en español. Responder, documentar y nombrar en español (salvo identificadores de código, que van en inglés técnico cuando aporte claridad).

---

## 1. Qué es este proyecto

Aplicación **frontend web** de la **Universidad de Cundinamarca (UCundinamarca)** para presentar **temas/módulos** y, dentro de cada uno, **vistas tipo dashboard** (gráficas, tablas, indicadores).

### Dominio: seguimiento a Oportunidades de Mejora (OM) de la RXD

Cada **tema es un sistema de gestión** (SGC, SGA, SG-SST, SGSI, SGAS). Dentro de cada sistema, el dato base es la **Oportunidad de Mejora** derivada de la **Revisión por la Dirección (RXD)**:

- Una OM pertenece a una **vigencia** (el año del ciclo de RXD que la originó), tiene un responsable, un entregable comprometido y una fecha de entrega.
- Cada OM acumula **uno o más seguimientos**. Un seguimiento es una **observación** del funcionario evaluador en una **fecha de corte**, acompañada de su **calificación**.
- La **calificación** usa la escala institucional **0 · 0.5 · 1 · 1.5 · 2**, donde **2 = 100 % completado (cumplida)**. El avance porcentual de una OM es `calificación / 2 × 100`.
- El **estado vigente** de una OM es su **última calificación registrada**; las observaciones anteriores conservan el historial de cómo llegó hasta ahí.

Fuente de verdad: los libros de [`data/`](data/), importados con `pnpm datos:importar`. Detalle del modelo, normalizaciones y métricas en [`docs/datos.md`](docs/datos.md).

La app se organiza en **dos layouts** (ver [regla de layouts](.claude/reglas/REGLA_GENERAL_LAYOUTS_APLICACION.md)):

1. **Portada de temas** (`/temas`) — selección de módulos creados por el usuario.
2. **Layout interno** (`/temas/:temaId/:vista`) — menú lateral **fijo**, encabezado superior, **logo en la esquina superior derecha** y área de contenido intercambiable.

> El código Next.js (App Router) vive en la raíz del proyecto, en `src/`. Comandos y arranque en [README.md](README.md).

---

## 2. Stack tecnológico (últimas versiones estables y seguras)

Regla dura del proyecto: **siempre la última versión estable y con soporte de seguridad activo.** Antes de fijar versiones, verificar con `pnpm outdated` y `pnpm audit`.

| Capa | Tecnología | Nota |
|---|---|---|
| Framework | **Next.js (última estable, App Router)** | React Server Components por defecto; `src/` dir; alias `@/*` |
| UI runtime | **React (última estable)** | Server Components + Client Components solo donde haya interacción |
| Lenguaje | **TypeScript** en modo `strict` | `noUncheckedIndexedAccess` recomendado |
| Estilos | **Tailwind CSS (última estable) + tokens CSS institucionales** | Los ejemplos de las reglas ya usan utilidades Tailwind (`h-12 w-auto object-contain`) |
| Gestor de paquetes | **pnpm — ÚNICO, sin excepciones** | Ver §3 |
| Runtime | **Node.js LTS** (20/22) | Fijado en `engines` y `.nvmrc` |

**Seguridad como requisito, no opción:**
- Ejecutar `pnpm audit` en cada instalación y en CI; no fusionar con vulnerabilidades altas/críticas.
- Mantener dependencias al día (`pnpm update --latest` revisando breaking changes).
- Nada de secretos en el cliente: usar variables de entorno del servidor (sin prefijo `NEXT_PUBLIC_` salvo que sea realmente público).
- Cabeceras de seguridad en `next.config`, y validación de entrada en toda frontera (formularios, params de ruta, respuestas de API).
- Preferir Server Components / server actions para no exponer lógica ni claves al navegador.

---

## 3. Gestor de paquetes: SOLO pnpm (obligatorio, sin excepción)

**Prohibido `npm` y `yarn`.** No debe existir `package-lock.json` ni `yarn.lock`; el único lockfile válido es `pnpm-lock.yaml` (versionado en git).

Mecanismos de refuerzo que deben existir en el repo:

- `package.json` → `"packageManager": "pnpm@<version>"` y `"engines": { "node": ">=20", "pnpm": ">=9" }`.
- `package.json` → `"scripts": { "preinstall": "npx only-allow pnpm" }` (bloquea instalaciones con npm/yarn).
- `.npmrc` → `engine-strict=true`.
- Habilitar Corepack: `corepack enable` (usa la versión de pnpm declarada en `packageManager`).

Todo comando del proyecto se ejecuta con `pnpm` / `pnpm dlx` (nunca `npx` salvo el guard `only-allow`).

---

## 4. Comandos

**Scaffold inicial** (una sola vez, en la raíz del proyecto):

```bash
corepack enable
pnpm create next-app@latest . --ts --app --src-dir --tailwind --eslint --use-pnpm --import-alias "@/*"
```

**Desarrollo (una vez inicializado):**

```bash
pnpm install          # instalar dependencias (genera pnpm-lock.yaml)
pnpm dev              # servidor de desarrollo
pnpm build            # build de producción
pnpm start            # servir el build
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
pnpm test             # pruebas de extremo a extremo (Playwright)
pnpm datos:importar   # regenera src/data/om-rxd.json desde data/*.xlsx
pnpm audit            # auditoría de seguridad
pnpm outdated         # dependencias desactualizadas
```

Ejecutar un solo test (una vez elegido el runner, p. ej. Vitest): `pnpm test <ruta-del-test>` o `pnpm test -t "<nombre>"`.

---

## 5. Arquitectura frontend

### 5.1 Mapeo de los dos layouts al App Router

La regla de layouts se implementa con **layouts anidados** de Next.js (App Router). La estructura de rutas refleja 1:1 la jerarquía de la regla:

```
src/app/
├── layout.tsx                     # Raíz: fuente Montserrat, tokens CSS, providers globales
├── consolidado/
│   └── page.tsx                   # Comparación entre TODOS los sistemas (/consolidado)
├── temas/
│   ├── page.tsx                   # Layout 1 — Portada de temas  (ruta /temas)
│   └── [temaId]/
│       ├── page.tsx               # Redirige a /temas/:temaId/resumen
│       ├── layout.tsx             # Layout 2 — MenuLateralFijo + EncabezadoSuperior
│       ├── resumen/
│       │   └── page.tsx           # Vista Resumen (/temas/:temaId/resumen)
│       ├── indicadores/
│       │   └── page.tsx           # Vista Indicadores (/temas/:temaId/indicadores)
│       ├── responsables/
│       │   └── page.tsx           # Vista Responsables (/temas/:temaId/responsables)
│       ├── datos/
│       │   └── page.tsx           # Vista Datos (/temas/:temaId/datos)
│       └── seguimiento/
│           └── page.tsx           # Vista Seguimiento (/temas/:temaId/seguimiento)
```

> La vista `reportes/` fue reemplazada por `responsables/`: los libros de origen no contienen informes descargables, y el área responsable sí es una dimensión real de los datos ([ADR-0003](docs/adr/0003-vista-responsables.md)).

> **`/consolidado` es ruta de primer nivel, no una sexta vista.** El layout interno trabaja *dentro* de un sistema (menú lateral y filtros ligados a `temaId`); la vista consolidada compara **entre** sistemas, así que su dimensión de análisis es el propio sistema y no cabe bajo `[temaId]`. Se alcanza desde la portada y desde el menú lateral de cualquier tablero.

**Principios de esta estructura:**

- **Cada vista es una carpeta independiente** en el App Router. No usar parámetros dinámicos `[vista]` que resuelvan múltiples vistas con condicionales.
- El `layout.tsx` de `[temaId]` es **fijo y reutilizable**: contiene el menú lateral no colapsable, el encabezado y el logo (Regla layouts §6–8, §10).
- El contenido de cada vista (`children`) se carga sin alterar la estructura general (Regla layouts §11).
- Componentes específicos de una vista se colocan en `_components/` dentro de esa vista (ver regla de scaffolding §4).
- La selección de tema viaja por la **ruta** (`temaId`), no por estado global efímero (Regla layouts §13).

### 5.2 Estructura de carpetas (por capas + features)

```
data/                   # Libros de seguimiento (.xlsx) — fuente de verdad
scripts/                # ETL sin dependencias: data/*.xlsx → src/data/om-rxd.json
src/
├── app/                # Rutas, layouts y globals.css con los tokens institucionales
├── components/
│   ├── ui/             # Primitivos reutilizables (Icon…)
│   ├── brand/          # LogoUcundinamarca y elementos de identidad (§7)
│   ├── layout/         # Sidebar, ViewHeader, VistaShell
│   ├── dashboard/      # DashboardShell, KPIRow, FilterBar, EstadoVacio
│   └── charts/         # ChartCard + estados + tipos de gráfica (Regla dashboard)
├── data/               # Dataset generado por el ETL (versionado)
├── features/
│   ├── temas/          # Portada: TarjetaTema y registro (registry) de temas
│   └── dashboard/      # FiltrosProvider, useTableroOM, kpis
├── lib/om/             # Acceso a datos (abstracción) y métricas de OM
└── types/              # Contratos/tipos compartidos
```

**Capa de datos (SOLID «D»).** La UI depende de `src/lib/om/` y de `useTableroOM`, nunca del JSON ni de un `fetch` concreto: cambiar el origen a una API o a un modelo semántico solo exige reescribir `src/lib/om/dataset.ts` ([ADR-0001](docs/adr/0001-fuente-de-datos-etl-excel-a-json.md)).

**Colocación (organización por vista — obligatoria).** Regla clave: un componente vive lo más cerca posible de donde se usa. 

- Si es **específico de una vista**, se coloca dentro de esa vista (`app/temas/[temaId]/<vista>/_components/`, p. ej. `app/temas/[temaId]/resumen/_components/ResumenKPIs.tsx`).
- Si es **general/reutilizable** (se usa en 2+ vistas o es un primitivo), va a `components/` (ui, brand, layout, charts).
- **Promoción:** cuando un componente colocado se necesita en una **segunda** vista, se **mueve** a general (nunca se copia).
- Detalle completo en la [regla de scaffolding](.claude/reglas/REGLA_SCAFFOLDING_ORGANIZACION_POR_VISTAS.md) — especialmente §4, que requiere una carpeta física independiente por vista, no un parámetro dinámico.

### 5.3 Gráficas (Regla dashboard §10 — obligatoria)

> **Lectura obligatoria antes de crear o modificar cualquier gráfica:** [`regla_diseno_dashboard.md`](.claude/reglas/regla_diseno_dashboard.md) completa. No se escribe ni un componente de gráfica sin haberla leído; el checklist de §9 de este archivo no reemplaza esa lectura.

Toda gráfica se envuelve en un **`ChartCard`** que garantiza, de forma reutilizable: título descriptivo, etiquetas/ejes/tooltip, leyenda cuando hay varias series, comportamiento responsivo, estados **Cargando / Sin datos / Error / Filtrada / Seleccionada**, e **interacción como filtro** sincronizada con los filtros generales del dashboard. Ninguna gráfica se integra si no cumple ese contrato.

- La librería en uso es **Recharts**. La selección **no** puede depender solo del color (Regla dashboard §8–9): añadir borde/ícono/opacidad/texto.
- El estado de filtros vive en un **contexto compartido** (`features/dashboard/FiltrosProvider`), montado en el layout del tema, de modo que seleccionar un elemento en una gráfica actualiza las demás y la selección se conserva al navegar entre vistas (Regla dashboard §3–4).
- Los segmentos y barras de Recharts **no son focalizables con teclado**. Toda gráfica seleccionable se acompaña de `LeyendaInteractiva` (botones con `aria-pressed`) o del selector equivalente de la barra de filtros (Regla dashboard §11).
- Una gráfica que filtra por una dimensión **no se filtra a sí misma** por ella: usar `omsIgnorando(campo)` de `useTableroOM`, o la gráfica quedaría reducida a la categoría seleccionada.
- La escala de estados (color + símbolo por estado) se define **una sola vez** en `src/lib/om/avance.ts`; ninguna gráfica define su propia paleta (Regla dashboard §10).

Catálogo completo en [`docs/componentes.md`](docs/componentes.md); métricas y su justificación en [`docs/datos.md`](docs/datos.md).

---

## 6. Principios de código: DRY + SOLID

Estos principios son **requisito de aceptación**, no sugerencia:

**DRY**
- **Única fuente de verdad** para color, tipografía y logo: los tokens de §7 y `styles/globals.css`. **Prohibido** escribir HEX sueltos en componentes cuando existe un token institucional (Regla visual §1.7).
- Componentes reutilizables para todo lo repetible: `TarjetaTema`, `MenuLateralFijo`, `LogoUcundinamarca`, `ChartCard`, estados vacíos/carga/error. No duplicar el menú lateral por página (Regla layouts §15).

**SOLID**
- **S — Responsabilidad única:** separar componentes de presentación ("tontos") de la obtención de datos (hooks/containers). Una gráfica pinta; no sabe de dónde vienen los datos.
- **O — Abierto/Cerrado:** agregar temas y vistas **sin** modificar la arquitectura (Regla layouts §2, §15). Usar un **registro (registry)** de temas/vistas al que se añaden entradas.
- **L — Sustitución de Liskov:** todos los tipos de gráfica cumplen una interfaz común `ChartProps`; son intercambiables dentro de `ChartCard`.
- **I — Segregación de interfaces:** props/contratos pequeños y enfocados (`Filterable`, `ChartState`), no props "gigantes".
- **D — Inversión de dependencias:** la UI depende de **abstracciones de datos** (`lib/` + hooks como `useTemas()`, `useDashboardData()`), no de un fetch concreto. Así se puede cambiar la fuente (REST, Power BI, mock) sin tocar la UI.

---

## 7. Identidad visual y logotipo

**Fuente de verdad de los recursos gráficos:** [`.claude/lmagenes/`](.claude/lmagenes/) (originales institucionales). Contiene escudos e imagotipos horizontal/vertical en **color / negro / blanco** (PNG), la subcarpeta `PNG 480px/` y el vector fuente **`LOGO VECTORES.ai`**. Ignorar la carpeta `__MACOSX/` (basura de compresión, no versionar).

**Pipeline hacia la app:** los recursos que use la UI se copian a **`public/brand/`** (servidos en `/brand/...`). Como **no hay SVG**, la regla visual §2.1 permite PNG transparente; lo ideal es exportar SVG desde `LOGO VECTORES.ai`. Mapeo sugerido:

| Origen en `.claude/lmagenes/` | Destino `public/brand/` | Uso |
|---|---|---|
| `IMAGOTIPO HORIZONTAL NEGRO.png` | `imagotipo-horizontal-negro.png` | **Identificador principal** sobre fondos claros (monocromático) |
| `IMAGOTIPO HORIZONTAL BLANCO.png` | `imagotipo-horizontal-blanco.png` | Identificador sobre fondos oscuros |
| `IMAGOTIPO HORIZONTAL COLOR.png` | `imagotipo-horizontal-color.png` | Uso a color cuando el fondo lo permita |
| `IMAGOTIPO VERTICAL *.png` | `imagotipo-vertical-*.png` | Solo cuando el espacio sea reducido |
| `ESCUDO COLOR.png` | `escudo-color.png` | **Uso restringido/simbólico** y favicon; nunca como logo operativo |

**Reglas de aplicación (resumen de la [regla visual](.claude/reglas/REGLAS_VISUALES_UCUNDINAMARCA.md)):**
- El **identificador principal** de la interfaz es el **imagotipo horizontal monocromático**; el **escudo NO** se usa como logo operativo del dashboard (§2.1–2.2, §2.4).
- En el layout interno, el logo va en la **esquina superior derecha**, visible en todas las vistas, con proporciones intactas y área de seguridad (Regla layouts §10).
- Mantener relación de aspecto: `object-fit: contain`; nunca deformar, rotar, recolorear ni agregar efectos (§2.4).
- Encapsular **todas** estas reglas en un único componente **`LogoUcundinamarca`** (variante `horizontal|vertical`, `tono` según fondo, `alt="Universidad de Cundinamarca"`). Nadie debe insertar `<img>` de logo suelto.

**Logotipos de los sistemas de gestión.** Cada sistema tiene su propio logotipo oficial. Origen: [`imagenes/`](imagenes/); destino servido: `public/brand/sistemas/<id>.png`, donde `<id>` es el mismo del registro de temas.

| Origen en `imagenes/` | Destino `public/brand/sistemas/` | Sistema |
|---|---|---|
| `sgc3092.png` | `sgc.png` | Sistema de Gestión de Calidad |
| `sga3091.png` | `sga.png` | Sistema de Gestión Ambiental |
| `sgsst3094.png` | `sgsst.png` | Seguridad y Salud en el Trabajo |
| `sgsi-4.png` | `sgsi.png` | Seguridad de la Información |
| `logo-anti-soborno_1.png` | `sgas.png` | Sistema de Gestión Antisoborno |

Se insertan **solo** mediante el componente `LogoSistema`. Son identificadores **secundarios**: el principal de la interfaz sigue siendo el imagotipo institucional (regla visual §2.1). Como llevan el nombre del sistema dentro del arte, no se reducen por debajo de ~58 px de alto (§2.5).

**Tokens de color y tipografía:** copiar **tal cual** los `:root` de la regla visual (§1.8 y §3.6) a `styles/globals.css` y exponerlos a Tailwind. Predominio de `--uc-green` (#007B3E) y `--uc-green-dark` (#00482B); amarillo/oro para énfasis; máximo un color principal + dos complementarios por vista; solo los 4 degradados oficiales.

**Tipografía — atención (coherencia con Next.js):** la familia principal es **`Montserrat`** (Regla visual §3). El `create-next-app` trae Geist/Inter por defecto y la regla **prohíbe `Inter`** como principal (§3.5). Configurar `Montserrat` vía `next/font/google` en `app/layout.tsx` y exponerla como `--uc-font-digital`.

---

## 8. Coherencia entre reglas (revisado)

Las reglas son **complementarias** y aplican por separación de responsabilidades:

- [`REGLAS_VISUALES_UCUNDINAMARCA.md`](.claude/reglas/REGLAS_VISUALES_UCUNDINAMARCA.md) → **identidad** (color, logo, tipografía). Alcance cerrado a esos temas.
- [`regla_diseno_dashboard.md`](.claude/reglas/regla_diseno_dashboard.md) → **gráficas** (títulos, etiquetas, interacción-filtro, estados, responsive).
- [`REGLA_GENERAL_LAYOUTS_APLICACION.md`](.claude/reglas/REGLA_GENERAL_LAYOUTS_APLICACION.md) → **navegación** (portada + layout interno, menú lateral fijo, logo arriba a la derecha).
- [`REGLA_DOCUMENTACION_Y_ACTUALIZACION.md`](.claude/reglas/REGLA_DOCUMENTACION_Y_ACTUALIZACION.md) → **documentación** (docs-as-code: README, CLAUDE.md, `docs/`, ADR, CHANGELOG; se actualiza en el mismo cambio que la origina).
- [`REGLA_SCAFFOLDING_ORGANIZACION_POR_VISTAS.md`](.claude/reglas/REGLA_SCAFFOLDING_ORGANIZACION_POR_VISTAS.md) → **organización del código** (colocación por vista: específico dentro de la vista, general en `components/`; promover al reutilizar en una 2.ª vista).

Documentación viva del proyecto: [`docs/arquitectura.md`](docs/arquitectura.md) · [`docs/datos.md`](docs/datos.md) · [`docs/componentes.md`](docs/componentes.md) · [`docs/adr/`](docs/adr/) · [`CHANGELOG.md`](CHANGELOG.md).

Puntos reconciliados (no son contradicciones, son decisiones de implementación):
1. **Ruta del logo:** el ejemplo de la regla visual apunta a `/brand/...svg`, pero los originales son PNG en `.claude/lmagenes/`. Resolución: copiar a `public/brand/` (PNG permitido; exportar SVG del `.ai` cuando se pueda).
2. **Tipografía por defecto de Next.js vs. regla:** Next trae Inter/Geist; la regla exige Montserrat y prohíbe Inter → configurar Montserrat explícitamente (§7).
3. **Escudo como favicon:** permitido por ser uso simbólico; el identificador de la UI sigue siendo el imagotipo, nunca el escudo.
4. **"No solo color" para estados activos/selección:** exigido por dashboard §8–9 **y** layouts §8.3 → reforzar siempre con borde/ícono/tipografía además del color.

---

## 9. Checklist antes de crear/modificar una vista o gráfica

- [ ] Respeta los **dos layouts** y no duplica el menú lateral (layouts §15, §18).
- [ ] Usa **tokens** institucionales; cero HEX sueltos (visual §1.7).
- [ ] Tipografía **Montserrat**; jerarquía y pesos consistentes (visual §3).
- [ ] Logo mediante `LogoUcundinamarca`, arriba a la derecha en layout interno (visual §2 / layouts §10).
- [ ] Cada gráfica cumple el contrato de dashboard §10 (título, etiquetas, estados, filtro, limpiar selección).
- [ ] Selección/estado activo señalado con **más de un recurso** (no solo color).
- [ ] Responsive escritorio/tableta/móvil sin menú hamburguesa en escritorio (layouts §14).
- [ ] Componentes reutilizables (DRY) y con responsabilidad única (SOLID).
- [ ] **Colocación correcta**: lo específico dentro de la vista (`_components/`), lo general en `components/`; nada duplicado entre vistas — [regla de scaffolding](.claude/reglas/REGLA_SCAFFOLDING_ORGANIZACION_POR_VISTAS.md).
- [ ] **Documentación actualizada en el mismo cambio** (README/CLAUDE.md/`docs/`/TSDoc; ADR y CHANGELOG si aplica) — [regla de documentación](.claude/reglas/REGLA_DOCUMENTACION_Y_ACTUALIZACION.md).
- [ ] `pnpm lint`, `pnpm typecheck` y `pnpm audit` en verde.

---

> Nota de convención: este archivo vive en la **raíz** del proyecto para que Claude Code cargue la memoria de proyecto automáticamente en cada sesión. Las reglas (`.claude/reglas/`), la configuración (`.claude/settings.json`) y las imágenes (`.claude/lmagenes/`) permanecen dentro de `.claude/`. Fuente única: no duplicar este archivo.
