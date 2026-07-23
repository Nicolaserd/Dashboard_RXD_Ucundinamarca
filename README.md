# Tableros institucionales — Universidad de Cundinamarca

Aplicación web de tableros de gestión e indicadores de la Universidad de Cundinamarca.
Construida aplicando las reglas de diseño del proyecto (identidad visual, layouts,
gráficas de dashboard, documentación y organización por vistas).

> Guía maestra para el desarrollo: [CLAUDE.md](CLAUDE.md). Reglas: [.claude/reglas/](.claude/reglas/).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS 4** + tokens institucionales (`src/app/globals.css`)
- Tipografía **Montserrat** (`next/font`)
- Gestor de paquetes: **pnpm** (único, sin excepción)

## Requisitos

- **Node.js** 20 o superior
- **pnpm** 9 o superior (recomendado vía `corepack enable`)

## Arranque

```bash
corepack enable        # habilita pnpm
pnpm install           # instala dependencias
pnpm dev               # http://localhost:3000
```

> Solo **pnpm**. `npm` y `yarn` están bloqueados por un guard `preinstall` (only-allow pnpm).

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Sirve el build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Verificación de tipos (`tsc --noEmit`) |

## Estructura

```
src/
├── app/                       # Rutas y layouts (App Router)
│   ├── temas/                 # Portada de temas (Layout 1)
│   └── temas/[temaId]/        # Layout interno (Layout 2)
│       ├── _components/       # Componentes COLOCADOS de la vista
│       └── _data.ts           # Datos de demostración de la vista
├── components/                # Componentes GENERALES reutilizables
│   ├── brand/                 # LogoUcundinamarca
│   ├── layout/                # Sidebar, ViewHeader
│   ├── charts/                # ChartCard, BarChart, LineChart, DonutChart…
│   └── ui/                    # Icon
├── features/                  # temas (registry), dashboard (estado/filtro)
├── lib/                       # utilidades (format)
└── types/                     # contratos compartidos

public/brand/                  # logos oficiales (copiados desde .claude/lmagenes)
```

## Rutas

- `/temas` — portada con las tarjetas de temas.
- `/temas/:temaId` — tablero del tema (vista Resumen).

## Nota

Los datos son de demostración. La interacción-como-filtro (clic en una barra de
"Estudiantes por sede") ilustra el patrón exigido por la regla de dashboard.
