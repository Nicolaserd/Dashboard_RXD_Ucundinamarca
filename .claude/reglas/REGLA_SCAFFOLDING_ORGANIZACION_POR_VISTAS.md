# Regla de scaffolding y organización por vistas

## 1. Propósito

Definir **cómo se organiza el código de la interfaz**: la arquitectura se estructura **por página/vista**, y cada componente vive **lo más cerca posible de donde se usa** (colocación / *colocation*).

Principio base:

> Un componente que se usa **en una sola vista** vive **dentro de esa vista**. Un componente que es **general** (se reutiliza en varias vistas o es transversal) vive en la **carpeta de componentes generales**.

Esta regla es **general y flexible**: aplica a cualquier tema, módulo o vista, sin imponer cuántos componentes debe tener cada uno.

---

## 2. Principios generales

- **Colocación:** el código específico de una vista (componentes, hooks, utilidades, tipos) se ubica junto a esa vista.
- **Promoción a general:** cuando algo deja de ser específico de una vista, se **mueve** (no se copia) a la zona general.
- **DRY sin abstracción prematura:** no generalizar "por si acaso"; se empieza colocado y se promueve **cuando exista una segunda necesidad real** (ver §5).
- **Responsabilidad única (SOLID):** cada componente hace una cosa; separar presentación de obtención de datos.
- **Sin dependencias cruzadas:** una vista **no importa** componentes privados de otra vista (ver §7).
- Coherente con las demás reglas: [visuales](REGLAS_VISUALES_UCUNDINAMARCA.md), [dashboard](regla_diseno_dashboard.md), [layouts](REGLA_GENERAL_LAYOUTS_APLICACION.md) y [documentación](REGLA_DOCUMENTACION_Y_ACTUALIZACION.md).

---

## 3. Qué es "general" y qué es "específico de vista"

### 3.1 Componentes generales (compartidos)

Van en `src/components/` (u hooks/utilidades en `src/hooks/`, `src/lib/`, `src/types/`). Son generales cuando cumplen **al menos una** de estas condiciones:

- Se usan (o se usarán con certeza) en **dos o más vistas**.
- Son **primitivos de UI** (botón, tarjeta, input, skeleton, estado vacío).
- Son de **identidad/marca** (`LogoUcundinamarca`).
- Son de **estructura de layout** (menú lateral fijo, encabezado, layouts de portada/interno).
- Son **bases reutilizables** transversales (p. ej. `ChartCard` de la regla de dashboard).

```
src/components/
├── ui/        # primitivos generales
├── brand/     # identidad
├── layout/    # estructura de navegación
└── charts/    # bases de gráficas reutilizables
```

### 3.2 Componentes específicos de vista

Se **colocan dentro de la vista** cuando:

- Solo tienen sentido en esa vista.
- Dependen de la lógica o los datos particulares de esa vista.
- No se prevé reutilizarlos fuera de ella.

---

## 4. Estructura de una vista

En el App Router de Next.js, las subcarpetas privadas usan el prefijo **`_`** para no crear rutas. Estructura recomendada de una vista:

```
app/temas/[temaId]/[vista]/
├── page.tsx           # ensambla la vista (composición)
├── _components/       # componentes SOLO de esta vista
│   ├── PanelResumen.tsx
│   └── TablaDetalle.tsx
├── _hooks/            # hooks solo de esta vista (opcional)
└── _lib/              # utilidades/tipos solo de esta vista (opcional)
```

- Si la vista es simple, basta con `page.tsx` y quizá un `_components/`.
- Alternativa equivalente: agrupar la vista en `src/features/<vista>/` con la misma lógica de colocación. Lo importante no es la carpeta exacta, sino **el principio de colocación + promoción**.

---

## 5. Regla de promoción (el corazón de la regla)

1. Un componente nace **colocado** en la vista donde se necesita por primera vez.
2. En el momento en que **una segunda vista** necesita ese mismo componente:
   - **No** se copia ni se importa desde la otra vista.
   - Se **mueve** a la zona general que corresponda (`components/ui`, `components/charts`, etc.).
   - Se actualizan las importaciones de ambas vistas al nuevo origen.
3. Si un componente general deja de ser compartido y queda en una sola vista, **puede** volver a colocarse (opcional; no obligatorio).

> Regla práctica ("de dos"): a la **segunda** vez que se necesita, se generaliza. La primera vez, se coloca.

---

## 6. Árbol de decisión

Al crear un componente, preguntar en orden:

1. ¿Es un primitivo de UI, identidad, layout o base de gráfica? → **general**.
2. ¿Se usará en dos o más vistas? → **general**.
3. ¿Es propio de la lógica/datos de **una sola** vista? → **colocado** en esa vista.
4. ¿Duda? → **colocarlo**; promoverlo después si aparece la segunda necesidad (evita abstracción prematura).

---

## 7. Prohibiciones

- **No** importar componentes privados (`_components`) de una vista desde otra vista. Si se necesita en dos, **promover**.
- **No** copiar/pegar el mismo componente entre vistas (rompe DRY): promover.
- **No** colocar en `components/` general algo que usa una sola vista "por si acaso".
- **No** duplicar la lógica de layout o identidad dentro de una vista; usar los componentes generales existentes.
- **No** crear estructuras de carpeta distintas para cada vista sin justificación (mantener el patrón).
- **No** exponer como ruta las carpetas de componentes: usar el prefijo `_` en el App Router.

---

## 8. Flexibilidad de la regla

Esta regla **no** define cuántos componentes ni qué contiene cada vista. Se adapta a:

- Cantidad y complejidad de vistas.
- Uso de carpetas colocadas (`_components`) o de `features/<vista>/`.
- Necesidad de subdividir una vista en subcomponentes.

Se permite:

- Agregar nuevas vistas replicando el patrón, sin tocar las existentes (Abierto/Cerrado).
- Anidar `_components/` dentro de un componente colocado grande.
- Mover componentes entre "colocado" y "general" según evolucione el uso.

No se permite:

- Romper el principio de colocación (todo en general) o el de promoción (duplicar entre vistas).

---

## 9. Instrucción de ejecución para Claude

Al crear o modificar una vista:

1. Colocar los componentes específicos dentro de la vista (`_components/`).
2. Usar los componentes **generales** existentes para UI, identidad, layout y gráficas; no reimplementarlos.
3. Si un componente colocado se necesita en una segunda vista, **moverlo** a general y actualizar las importaciones.
4. Nunca importar componentes privados de otra vista ni copiar/pegar entre vistas.
5. Ante la duda, colocar; generalizar solo con una segunda necesidad real.
6. Actualizar la documentación en el mismo cambio (regla de documentación).

---

## 10. Criterios de aceptación

La implementación cumple esta regla cuando:

- Cada vista contiene **solo** sus componentes específicos.
- Los componentes reutilizados viven en la zona **general** y no están duplicados.
- Ninguna vista importa componentes privados de otra vista.
- El patrón de carpetas es consistente entre vistas.
- Se pueden agregar nuevas vistas sin modificar las existentes.
- No hay componentes "generales" que en realidad use una sola vista.

---

## 11. Regla resumida

> La arquitectura se organiza **por vista**. Cada componente vive lo más cerca posible de donde se usa: **específico de una vista → dentro de la vista**; **reutilizable o transversal → en componentes generales**. Un componente nace colocado y se **promueve** a general en cuanto una segunda vista lo necesita, moviéndolo (nunca copiándolo). La regla es general, flexible y admite agregar vistas nuevas sin alterar las existentes.
