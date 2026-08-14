# Tableros de gestión — Universidad de Cundinamarca

Aplicación web para el **seguimiento a las Oportunidades de Mejora (OM)** derivadas de la
**Revisión por la Dirección (RXD)** en los sistemas de gestión de la Universidad de Cundinamarca.

Cada sistema de gestión es un **tema** con su propio tablero: avance del portafolio de OM, cortes de
seguimiento, indicadores de gestión, desempeño por área responsable y el detalle auditable de cada
oportunidad.

| Sistema | Sigla | OM | Vigencias |
|---|---|---:|---|
| Sistema de Gestión de Calidad | SGC | 76 | 2022–2025 |
| Sistema de Gestión Ambiental | SGA | 25 | 2022–2025 |
| Seguridad y Salud en el Trabajo | SG-SST | 23 | 2023–2025 |
| Seguridad de la Información | SGSI | 14 | 2023–2025 |
| Sistema de Gestión Antisoborno | SGAS | 10 | 2024–2025 |

La vista **Todos los sistemas de gestión** (`/consolidado`) compara el estado vigente de los cinco
sistemas entre sí, antes de entrar al tablero de uno en particular. Es la acción principal de la
portada.

> Los datos provienen de los libros de seguimiento en [`data/`](data/) y se importan con
> `pnpm datos:importar`. Ver [documentación de datos](docs/datos.md).

---

## Stack

- **Next.js 16** (App Router, React Server Components) · **React 19** · **TypeScript** en modo `strict`
- **Tailwind CSS 4** + tokens CSS institucionales
- **Recharts** para las gráficas
- **Playwright** para pruebas de extremo a extremo
- **pnpm** como único gestor de paquetes

## Requisitos

- **Node.js LTS** (20 o 22)
- **pnpm** (habilitar con `corepack enable`)

## Instalación y arranque

```bash
corepack enable
pnpm install
pnpm dev
```

Abrir [http://localhost:3000/temas](http://localhost:3000/temas).

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servir el build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Pruebas de extremo a extremo (Playwright) |
| `pnpm test:ui` | Playwright en modo interactivo |
| `pnpm datos:limpiar` | Genera `data-limpio/*.xlsx` (libros planos) desde `data/*.xlsx` |
| `pnpm datos:importar` | Limpia y regenera `src/data/om-rxd.json` |
| `pnpm audit` | Auditoría de seguridad de dependencias |
| `pnpm outdated` | Dependencias desactualizadas |

Ejecutar una sola prueba: `pnpm test -g "<nombre de la prueba>"`.

## Actualizar los datos

Al recibir libros de seguimiento nuevos:

```bash
# 1. Reemplazar o añadir los .xlsx en data/
# 2. Regenerar los libros limpios y el dataset
pnpm datos:importar
# 3. Verificar
pnpm typecheck && pnpm lint && pnpm test
```

El proceso reporta cuántas OM y cortes leyó por sistema, y avisa de hojas duplicadas o cortes con
fecha ininterpretable. Si algo no cuadra, `data-limpio/` permite revisar en Excel qué entendió el
importador antes de mirar el JSON. Detalle en [`docs/datos.md`](docs/datos.md).

## Estructura

```
data/                  Libros de seguimiento (.xlsx) — fuente de verdad
data-limpio/           Libros planos generados (no editar a mano)
imagenes/              Logotipos originales de los sistemas de gestión
scripts/               ETL sin dependencias, en dos pasos: limpiar → importar
src/
├── app/               Rutas y layouts (App Router)
│   ├── consolidado/   Comparación de la última medición de todos los sistemas
│   └── temas/         Portada de temas y layout interno con sus 5 vistas
├── components/        Componentes generales (ui, brand, layout, charts, dashboard)
├── data/              Dataset generado (versionado)
├── features/          Registro de temas y estado del tablero (filtros, KPIs)
├── lib/om/            Capa de acceso a datos y métricas de OM
└── types/             Contratos compartidos
e2e/                   Pruebas Playwright
docs/                  Arquitectura, datos, componentes y ADR
```

## Documentación

- [Guía maestra del proyecto (CLAUDE.md)](CLAUDE.md)
- [Arquitectura](docs/arquitectura.md) · [Datos](docs/datos.md) · [Componentes](docs/componentes.md)
- [Decisiones arquitectónicas (ADR)](docs/adr/)
- [Historial de cambios](CHANGELOG.md)
- Reglas de diseño y organización: [`.claude/reglas/`](.claude/reglas/)
