# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/); versionado según
[SemVer](https://semver.org/lang/es/).

## [0.2.0] — 2026-08-13

Primer tablero con datos institucionales reales. Reemplaza los datos de demostración por el
seguimiento a Oportunidades de Mejora (OM) de la Revisión por la Dirección.

### Añadido

- **ETL de datos** sin dependencias externas: `scripts/importar-om-rxd.mjs` y `scripts/lib/xlsx.mjs`
  convierten `data/*.xlsx` en `src/data/om-rxd.json` (148 OM, 794 registros de seguimiento en 5
  sistemas de gestión). Nuevo script `pnpm datos:importar` ([ADR-0001](docs/adr/0001-fuente-de-datos-etl-excel-a-json.md)).
- **Capa de datos y métricas** `src/lib/om/`: acceso único al dataset (`dataset.ts`), escala
  institucional de avance 0–2 (`avance.ts`), agregaciones puras (`metricas.ts`) y modelo de filtros
  (`filtros.ts`).
- **Contexto de filtros compartido** (`FiltrosProvider`) montado sobre las vistas de cada tema: una
  selección hecha en una gráfica actualiza todo el tablero y se conserva al navegar entre vistas
  (regla dashboard §3–4).
- **Hook `useTableroOM`**, punto de entrada de datos de las vistas, con `omsIgnorando(campo)` para el
  filtrado cruzado y controles de filtro derivados de los datos reales.
- **Vista «Todos los sistemas de gestión»** (`/consolidado`): el estado vigente de **todos** los
  sistemas en un solo tablero — KPIs del portafolio completo, avance comparado por sistema,
  composición apilada por estado y tabla con el último corte, cierre, carga pendiente y variación de
  cada uno. Es ruta de primer nivel porque compara *entre* sistemas, mientras que el layout interno
  trabaja *dentro* de uno. Es la **acción principal de la portada** (botón sólido con halo pulsante,
  visible sin desplazarse) y está también en el menú lateral de cualquier tablero. La animación se
  detiene al pasar el cursor o al enfocar con teclado, y `prefers-reduced-motion` la desactiva por
  completo dejando el botón con relieve fijo.
- **Vista Responsables** (`/temas/:temaId/responsables`): avance y carga por área institucional
  ([ADR-0003](docs/adr/0003-vista-responsables.md)).
- **Componentes de gráfica**: `BarrasCategoria` (barras con clic-para-filtrar, vertical u
  horizontal) y `LeyendaInteractiva` (leyenda que filtra, accesible con teclado, cubriendo el hueco
  de Recharts cuyos segmentos no son focalizables).
- **Estados Cargando y Error en `ChartCard`**, que ya cubría Sin datos y Filtrada: la envoltura
  completa el contrato de la regla de dashboard §9 y §12.
- **Logotipo propio de cada sistema de gestión**: nuevo componente `LogoSistema` y los cinco
  archivos copiados de `imagenes/` a `public/brand/sistemas/`. Aparecen en la tarjeta de la portada
  y en el encabezado del layout interno, como identificador secundario junto al institucional.
- **Sello de Acreditación Institucional** (`SelloAcreditacion`) en la esquina superior derecha de
  todas las vistas y en el pie, con un destello metálico que lo recorre. El brillo se enmascara con
  la propia imagen (`mask-image`), así que solo cubre los píxeles opacos del sello y nunca se
  desborda sobre su fondo transparente; `prefers-reduced-motion` lo desactiva.
- **Pie institucional** (`PieInstitucional`), compartido por la portada y la vista consolidada:
  declara «Elaborado por: Gobierno de Datos» y «Fuente: Control Interno», junto a la fecha de la
  última importación de los libros.
- **Favicon**: el escudo institucional (`src/app/icon.png`) sustituye al icono por defecto de
  Next.js. Uso simbólico permitido por la regla visual §2.2; el identificador de la interfaz sigue
  siendo el imagotipo, nunca el escudo.
- Se oculta el indicador de desarrollo de Next.js (`devIndicators: false`), que se superponía sobre
  el menú lateral en desarrollo. Nunca formó parte del build de producción.
- **Documentación**: `docs/arquitectura.md`, `docs/datos.md`, `docs/componentes.md`, cuatro ADR y
  este changelog. README reescrito en español y solo con pnpm.
- **Pruebas de extremo a extremo** reescritas (14 casos): KPIs, filtros sincronizados, interacción
  de la leyenda como filtro, persistencia de filtros entre vistas, estado vacío, orden y despliegue
  de la tabla, y cronología de cortes.

### Cambiado

- **El ETL pasa a dos pasos con un artefacto intermedio auditable**:
  `data/*.xlsx` → **`data-limpio/*.xlsx`** → `src/data/om-rxd.json`. El nuevo
  `scripts/limpiar-excel.mjs` concentra toda la interpretación de formato y escribe un libro por
  sistema —una hoja por vigencia, una fila por OM, sin celdas combinadas, filas vacías, hojas
  duplicadas ni totales—, con los encabezados de corte normalizados a fecha ISO. El importador,
  al recibir una tabla plana, se reduce a traducir columnas a campos. Nuevo escritor de `.xlsx` sin
  dependencias (`scripts/lib/xlsx-escribir.mjs`) y reglas de dominio compartidas
  (`scripts/lib/dominio.mjs`). Nuevo script `pnpm datos:limpiar`; `pnpm datos:importar` ejecuta
  ambos pasos. El dataset resultante es idéntico: 148 OM y 794 seguimientos.
- Los identificadores de las OM **sin `PM N°`** dejan de derivarse del número de fila —que cambiaba
  al insertar o quitar filas— y pasan a un sufijo estable derivado del texto de la oportunidad.
- **El importador ahora descombina las celdas y agrupa por `PM N°`.** Tres hojas (SGA 2024, SGSI
  2025 y SGC 2022) usan combinaciones verticales; en un `.xlsx` esas celdas guardan el valor solo en
  su esquina superior-izquierda. El lector lo replica en todo el rango y el importador consolida las
  filas consecutivas de una misma OM. El dataset resultante es idéntico al anterior —148 OM y 794
  seguimientos— porque hoy ninguna fila de continuación aporta datos; el cambio evita duplicar o
  perder registros si un libro futuro reparte el seguimiento entre varias filas, y avisa si ocurre.

- **Escala de color del avance rehecha como rampa ordinal de un solo tono**
  ([ADR-0004](docs/adr/0004-rampa-ordinal-de-avance.md)). La paleta categórica anterior falló la
  validación: «Avance parcial» y «Avance significativo» medían ΔE 5.8, indistinguibles incluso con
  visión de color completa. La nueva rampa deriva del verde institucional, con luminosidad monótona
  y los dos pasos oscuros en los tokens oficiales; «Sin seguimiento» queda fuera de la escala, en
  gris neutro.
- Correcciones derivadas de la revisión de visualización: el color viste la marca y no el texto
  (nuevo `EstadoTag`), rejillas continuas en lugar de punteadas, etiquetas directas solo en los
  puntos que cuentan la historia —no una sobre cada punto—, separación de 2 px entre segmentos del
  donut, y cifras destacadas con dígitos proporcionales en vez de `tabular-nums`.
- Dependencias actualizadas dentro de la misma versión mayor y `overrides` de pnpm para las
  transitivas con avisos de seguridad: `pnpm audit` queda sin vulnerabilidades conocidas.

- **Los temas del portal son ahora los sistemas de gestión** (`sgc`, `sga`, `sgsst`, `sgsi`,
  `sgas`), derivados del dataset ([ADR-0002](docs/adr/0002-temas-como-sistemas-de-gestion.md)). Las
  rutas `/temas/:temaId/...` cambian en consecuencia.
- Todas las vistas (Resumen, Indicadores, Datos, Seguimiento) reescritas sobre los datos reales.
- `FilterBar` pasa a ser un componente **controlado** por el contexto de filtros, para que los
  selectores y los clics en las gráficas escriban en el mismo estado y no se dupliquen los filtros.
- `KPIRow` deja de depender del módulo de datos de demostración y expone su propio tipo `KPI`, con
  variación respecto al corte anterior calculada sobre la serie real.
- `ViewHeader` muestra el corte de seguimiento vigente del sistema en lugar de un periodo fijo.
- Escala de color de estados unificada en `src/lib/om/avance.ts`: rampa ordinal dominada por los
  verdes institucionales, con oro como énfasis y gris neutro para la ausencia de avance.
- `pnpm-workspace.yaml`: se autorizan los scripts de instalación de `sharp` y `unrs-resolver`, que
  estaban sin decidir y bloqueaban la ejecución de cualquier script de `package.json`.

### Eliminado

- Datos de demostración `src/features/dashboard/dashboardData.ts`.
- Vista `reportes/` y su componente `ReportesView` ([ADR-0003](docs/adr/0003-vista-responsables.md)).
- `src/components/dashboard/filtros.ts`, cuyo constructor de filtros genéricos reemplaza
  `useTableroOM`.
- El ícono genérico de los temas (`Tema.icon`, el tipo `IconName` y los cinco glifos asociados):
  cada sistema se identifica ahora con su logotipo oficial.
- Estilos huérfanos en `globals.css` (hitos, tarjetas de reporte, métricas y barras de la versión
  anterior de las vistas).

## [0.1.0]

- Andamiaje inicial: layouts de portada e interno, identidad visual institucional, componentes de
  gráfica base y vistas con datos de demostración.
