import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * Pruebas de extremo a extremo del tablero de seguimiento a Oportunidades de
 * Mejora. Cubren el contrato que exige la regla de dashboard: KPIs, filtros
 * sincronizados, interacción de las gráficas como filtro, limpieza de la
 * selección y estado vacío.
 *
 * `sgc` (Sistema de Gestión de Calidad) es el sistema con más registros, así
 * que se usa como caso de referencia.
 *
 * Las cifras esperadas se **derivan del propio dataset**, nunca se escriben a
 * mano: así estas pruebas comprueban que la interfaz concuerda con los datos, y
 * no se rompen cada vez que se reimportan los libros de `data/`.
 */

const TEMA = "sgc";

interface OM {
  vigencia: string;
  seguimientos: { clasificacion: number | null }[];
}
// Ruta relativa a la raíz del proyecto, que es el directorio desde el que
// Playwright ejecuta (donde vive `playwright.config.ts`).
const DATASET: { sistemas: { id: string; oms: OM[] }[] } = JSON.parse(
  readFileSync("src/data/om-rxd.json", "utf8"),
);

const omsDe = (id: string) => DATASET.sistemas.find((s) => s.id === id)?.oms ?? [];
const TOTAL_OM = DATASET.sistemas.reduce((n, s) => n + s.oms.length, 0);
const OM_DEL_TEMA = omsDe(TEMA).length;
const SISTEMAS_CON_DATOS = DATASET.sistemas.filter((s) => s.oms.length > 0).length;

/** Estado vigente de una OM, con la misma regla que `src/lib/om/avance.ts`. */
const estadoDe = (om: OM) => {
  const ultima = [...om.seguimientos].reverse().find((s) => s.clasificacion !== null);
  if (!ultima) return "sin-seguimiento";
  return (
    { 2: "cumplida", 1.5: "avance-significativo", 1: "avance-parcial", 0.5: "avance-minimo", 0: "sin-avance" }[
      ultima.clasificacion as number
    ] ?? "sin-avance"
  );
};

/**
 * Combinación vigencia + estado que no deja ningún registro en `sgc`, buscada
 * en el dataset para que siga siendo válida aunque cambien los datos.
 */
const COMBINACION_VACIA = (() => {
  const oms = omsDe(TEMA);
  const vigencias = [...new Set(oms.map((o) => o.vigencia))].sort();
  const estados = [...new Set(oms.map(estadoDe))];
  for (const vigencia of vigencias) {
    for (const estado of estados) {
      if (!oms.some((o) => o.vigencia === vigencia && estadoDe(o) === estado)) {
        return { vigencia, estado };
      }
    }
  }
  throw new Error("No hay ninguna combinación vacía en el dataset");
})();

/** Vigencia presente en el menor número de sistemas, para el filtro global. */
const VIGENCIA_RARA = (() => {
  const conteo = new Map<string, number>();
  for (const s of DATASET.sistemas) {
    for (const v of new Set(s.oms.map((o) => o.vigencia))) conteo.set(v, (conteo.get(v) ?? 0) + 1);
  }
  const [vigencia, sistemas] = [...conteo.entries()].sort((a, b) => a[1] - b[1])[0];
  return { vigencia, sistemas };
})();

async function irA(page: Page, vista: string) {
  await page.goto(`/temas/${TEMA}/${vista}`);
  await expect(page.locator(".kpi").first()).toBeVisible();
}

test.describe("Portada de temas", () => {
  test("lista los sistemas de gestión con sus cifras reales", async ({ page }) => {
    await page.goto("/temas");

    await expect(page.locator("h1")).toContainText("Oportunidades de Mejora");
    await expect(page.locator("img").first()).toBeVisible();

    // Un tema por sistema de gestión con libro de seguimiento cargado.
    await expect(page.locator(".theme-card")).toHaveCount(SISTEMAS_CON_DATOS);

    // La cabecera declara el total de OM del portafolio completo.
    await expect(page.locator(".hero-meta .m").first().locator("b")).toHaveText(String(TOTAL_OM));
  });

  test("entrar a un sistema abre su vista Resumen", async ({ page }) => {
    await page.goto("/temas");
    await page.locator(".theme-card").first().click();

    await page.waitForURL(/\/temas\/[^/]+\/resumen/);
    await expect(page.locator(".view-head h1")).toHaveText("Resumen");
  });
});

test.describe("Vista Resumen", () => {
  test("muestra cuatro KPIs con valor", async ({ page }) => {
    await irA(page, "resumen");

    await expect(page.locator(".kpi")).toHaveCount(4);
    await expect(page.locator(".kpi .k-val").first()).not.toBeEmpty();
    await expect(page.locator(".kpi").first()).toContainText("Oportunidades de mejora");
  });

  test("las gráficas obligatorias llevan título y se dibujan", async ({ page }) => {
    await irA(page, "resumen");

    await expect(page.getByRole("heading", { name: /Evolución del avance/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Composición por estado/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Avance promedio por vigencia/ })).toBeVisible();

    // Recharts renderiza en SVG: una gráfica por tarjeta.
    expect(await page.locator(".chart-wrap svg").count()).toBeGreaterThanOrEqual(3);
  });

  test("el filtro de vigencia actualiza los KPIs y muestra el chip activo", async ({ page }) => {
    await irA(page, "resumen");

    const totalInicial = await page.locator(".kpi .k-val").first().textContent();

    await page.selectOption("#filtro-vigencia", "2023");

    await expect(page.locator(".filter-chip")).toContainText("Vigencia: 2023");
    await expect(page.locator(".kpi .k-val").first()).not.toHaveText(totalInicial ?? "");
    // La base declarada del KPI cambia cuando hay filtros activos.
    await expect(page.locator(".kpi").first()).toContainText(`de ${OM_DEL_TEMA} en el sistema`);
  });

  test("la leyenda de estados filtra el tablero y se puede limpiar", async ({ page }) => {
    await irA(page, "resumen");

    // La leyenda es la vía accesible por teclado a la selección del donut.
    const cumplidas = page.locator(".lg-boton", { hasText: "Cumplida" }).first();
    await cumplidas.click();

    await expect(cumplidas).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".filter-chip")).toContainText("Estado: Cumplida");
    await expect(page.locator(".filtered-badge").first()).toBeVisible();

    await page.getByRole("button", { name: "Limpiar filtros" }).click();
    await expect(page.locator(".filter-chip")).toHaveCount(0);
    await expect(cumplidas).toHaveAttribute("aria-pressed", "false");
  });

  test("una combinación sin resultados muestra el estado vacío", async ({ page }) => {
    await irA(page, "resumen");

    await page.selectOption("#filtro-vigencia", COMBINACION_VACIA.vigencia);
    await page.selectOption("#filtro-estado", COMBINACION_VACIA.estado);

    await expect(page.locator(".estado-vacio").first()).toBeVisible();
    await expect(page.locator(".kpi .k-val").first()).toHaveText("0");
  });
});

test.describe("Filtros compartidos entre vistas", () => {
  test("la selección se conserva al navegar por el menú lateral", async ({ page }) => {
    await irA(page, "resumen");
    await page.selectOption("#filtro-vigencia", "2024");
    await expect(page.locator(".filter-chip")).toContainText("Vigencia: 2024");

    await page.locator(".nav-item", { hasText: "Datos" }).click();
    await page.waitForURL(/\/datos/);

    await expect(page.locator(".filter-chip")).toContainText("Vigencia: 2024");
    await expect(page.locator("#filtro-vigencia")).toHaveValue("2024");
  });
});

test.describe("Vista Indicadores", () => {
  test("tabula los indicadores con valor, referencia y base", async ({ page }) => {
    await irA(page, "indicadores");

    const filas = page.locator(".data-table tbody tr");
    expect(await filas.count()).toBeGreaterThan(0);

    await expect(page.locator(".data-table")).toContainText("Tasa de cierre");
    await expect(page.locator(".estado-pill").first()).toBeVisible();
    await expect(page.locator(".nota-pie")).toContainText("umbrales de lectura");
  });
});

test.describe("Vista Responsables", () => {
  test("muestra el avance por área y permite filtrar desde la tabla", async ({ page }) => {
    await irA(page, "responsables");

    await expect(page.getByRole("heading", { name: /Avance promedio por área/ })).toBeVisible();

    const primeraArea = page.locator(".celda-filtro").first();
    const nombreArea = (await primeraArea.textContent())?.trim() ?? "";
    await primeraArea.click();

    await expect(page.locator(".filter-chip")).toContainText(nombreArea);
    await expect(page.locator("#filtro-area")).toHaveValue(nombreArea);
  });
});

test.describe("Vista Datos", () => {
  test("lista las OM y despliega el detalle de una fila", async ({ page }) => {
    await irA(page, "datos");

    const filas = page.locator(".tabla-om tbody tr");
    expect(await filas.count()).toBeGreaterThan(0);

    const boton = page.locator(".celda-om-boton").first();
    await expect(boton).toHaveAttribute("aria-expanded", "false");
    await boton.click();

    await expect(boton).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".detalle-om")).toContainText("Entregable comprometido");
  });

  test("el detalle muestra el historial completo de observaciones", async ({ page }) => {
    await irA(page, "datos");

    // Se filtra a las cumplidas: son las que acumulan más cortes de seguimiento.
    await page.selectOption("#filtro-estado", "cumplida");
    await page.locator(".celda-om-boton").first().click();

    await expect(page.locator(".detalle-historial h4")).toContainText("Observaciones del seguimiento");

    // Una OM acumula una observación por corte, cada una con su calificación.
    const observaciones = page.locator(".obs-item");
    expect(await observaciones.count()).toBeGreaterThan(1);
    await expect(observaciones.first()).toContainText("de 2");
    await expect(observaciones.first()).toContainText("Evaluó:");
  });

  test("la tabla se puede reordenar por columna", async ({ page }) => {
    await irA(page, "datos");

    const cabecera = page.getByRole("button", { name: /Vigencia/ });
    const columna = page.locator(".tabla-om tbody tr td:first-child");
    // Se comprueba el criterio de orden completo, no solo la primera celda:
    // con muchas OM de la misma vigencia, esa celda puede repetirse en ambos
    // sentidos y la comparación no diría nada.
    const vigencias = async () => (await columna.allTextContents()).map((t) => t.trim());

    // Se comprueba que la secuencia sea monótona, no que coincida con un array
    // reordenado: el orden es estable, así que las filas que empatan en vigencia
    // conservan su posición relativa en ambos sentidos.
    const monotona = (valores: string[], sentido: "asc" | "desc") =>
      valores.every((v, i) => i === 0 || (sentido === "asc" ? valores[i - 1] <= v : valores[i - 1] >= v));

    await cabecera.click();
    await expect(cabecera).toHaveText(/↑/);
    const ascendente = await vigencias();
    expect(ascendente.length).toBeGreaterThan(1);
    expect(monotona(ascendente, "asc")).toBe(true);

    await cabecera.click();
    await expect(cabecera).toHaveText(/↓/);
    expect(monotona(await vigencias(), "desc")).toBe(true);
  });
});

test.describe("Vista Seguimiento", () => {
  test("presenta la cronología de cortes y el historial de una OM", async ({ page }) => {
    await irA(page, "seguimiento");

    const cortes = page.locator(".cortes .corte");
    expect(await cortes.count()).toBeGreaterThan(0);
    await expect(cortes.first()).toContainText("Avance");

    await expect(page.locator("#om-historial")).toBeVisible();
    await expect(page.locator(".historial")).toContainText("Estado vigente");
  });
});

test.describe("Vista consolidada", () => {
  test("compara el estado vigente de todos los sistemas", async ({ page }) => {
    await page.goto("/consolidado");

    await expect(page.locator("h1")).toContainText("Todos los sistemas de gestión");
    await expect(page.locator(".kpi")).toHaveCount(4);
    // Las cifras son las del portafolio completo, no las de un sistema.
    await expect(page.locator(".kpi").first()).toContainText(String(TOTAL_OM));

    // Una fila por sistema con datos.
    await expect(page.locator(".celda-sistema")).toHaveCount(SISTEMAS_CON_DATOS);
    await expect(page.getByRole("heading", { name: /Avance promedio por sistema/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Composición del portafolio/ })).toBeVisible();
  });

  test("seleccionar un sistema abre su detalle y se puede limpiar", async ({ page }) => {
    await page.goto("/consolidado");

    const primero = page.locator(".celda-sistema").first();
    const sigla = (await primero.locator("b").textContent())?.trim() ?? "";
    await primero.click();

    await expect(primero).toHaveAttribute("aria-pressed", "true");
    const detalle = page.locator(".detalle-sistema-head");
    await expect(detalle).toBeVisible();
    await expect(page.getByRole("link", { name: /Abrir el tablero/ })).toBeVisible();

    await page.getByRole("button", { name: "Limpiar selección" }).click();
    await expect(detalle).toHaveCount(0);
    await expect(primero).toHaveAttribute("aria-pressed", "false");
    expect(sigla.length).toBeGreaterThan(0);
  });

  test("el filtro de vigencia recalcula las cifras globales", async ({ page }) => {
    await page.goto("/consolidado");
    const total = await page.locator(".kpi .k-val").first().textContent();

    await page.selectOption("#filtro-vigencia", VIGENCIA_RARA.vigencia);

    await expect(page.locator(".kpi .k-val").first()).not.toHaveText(total ?? "");
    // 2022 solo existe en SGC y SGA.
    await expect(page.locator(".celda-sistema")).toHaveCount(VIGENCIA_RARA.sistemas);
  });

  test("se llega desde la portada y desde el menú lateral", async ({ page }) => {
    await page.goto("/temas");
    // La acción principal de la portada, visible sin desplazarse.
    const boton = page.locator(".btn-primario");
    await expect(boton).toBeInViewport();
    await boton.click();
    await page.waitForURL(/\/consolidado/);

    await page.goto("/temas/sgc/resumen");
    await page.locator(".nav-item", { hasText: "Todos los sistemas" }).click();
    await page.waitForURL(/\/consolidado/);
    await expect(page.locator("h1")).toContainText("Todos los sistemas de gestión");
  });
});

test.describe("Identidad institucional", () => {
  test("el sello de acreditación está en todas las vistas del tablero", async ({ page }) => {
    for (const vista of ["resumen", "indicadores", "responsables", "datos", "seguimiento"]) {
      await page.goto(`/temas/${TEMA}/${vista}`);
      await expect(page.locator(".view-head .sello")).toBeVisible();
    }
  });

  test("el destello del sello recorre la imagen y se enmascara con ella", async ({ page }) => {
    await irA(page, "resumen");
    const brillo = page.locator(".view-head .sello-brillo");

    // La máscara es la propia imagen del sello: el destello no puede
    // desbordarse sobre el fondo transparente.
    const mascara = await brillo.evaluate((el) => getComputedStyle(el).maskImage);
    expect(mascara).toContain("sello-acreditacion.png");

    // Barrido: la posición del gradiente cambia a lo largo del ciclo.
    const posicionEn = (pct: number) =>
      brillo.evaluate((el, p) => {
        for (const a of el.getAnimations()) {
          a.pause();
          a.currentTime = 4600 * (p / 100);
        }
        return getComputedStyle(el).backgroundPosition;
      }, pct);

    expect(await posicionEn(10)).not.toBe(await posicionEn(30));
  });

  test("cada vista explica las siglas que usa", async ({ page }) => {
    const esperado: Record<string, string[]> = {
      resumen: ["OM", "RXD", "PM", "pp"],
      indicadores: ["OM", "pp"],
      responsables: ["OM"],
      datos: ["OM", "PM"],
      seguimiento: ["OM", "PM", "pp"],
    };

    for (const [vista, siglas] of Object.entries(esperado)) {
      await page.goto(`/temas/${TEMA}/${vista}`);
      const leyenda = page.locator(".siglas");
      await expect(leyenda).toBeVisible();
      for (const sigla of siglas) {
        await expect(leyenda.locator("dt", { hasText: new RegExp(`^${sigla}$`) })).toBeVisible();
      }
    }

    // La equivalencia completa se declara, no solo la sigla.
    await page.goto(`/temas/${TEMA}/resumen`);
    await expect(page.locator(".siglas")).toContainText("Oportunidad de Mejora");
    await expect(page.locator(".siglas")).toContainText("Revisión por la Dirección");
  });

  test("no se menciona el libro de origen en la interfaz", async ({ page }) => {
    for (const ruta of [
      "/temas",
      "/consolidado",
      `/temas/${TEMA}/responsables`,
      `/temas/${TEMA}/indicadores`,
    ]) {
      await page.goto(ruta);
      await expect(page.locator("body")).not.toContainText("libro de origen");
      await expect(page.locator("body")).not.toContainText("libros de origen");
    }
  });

  test("el pie declara quién lo elaboró y la fuente", async ({ page }) => {
    for (const ruta of ["/temas", "/consolidado"]) {
      await page.goto(ruta);
      const pie = page.locator(".portada-foot");
      await expect(pie).toContainText("Elaborado por");
      await expect(pie).toContainText("Gobierno de Datos");
      await expect(pie).toContainText("Fuente");
      await expect(pie).toContainText("Control Interno");
    }
  });

  test("el favicon es el escudo institucional", async ({ page }) => {
    await page.goto("/temas");
    const iconos = await page.evaluate(() =>
      [...document.querySelectorAll('link[rel~="icon"]')].map((l) => l.getAttribute("href") ?? ""),
    );
    expect(iconos.some((href) => href.includes("icon"))).toBe(true);

    // El archivo servido debe existir.
    const href = iconos.find((h) => h.includes("icon")) ?? "";
    const respuesta = await page.request.get(new URL(href, "http://localhost:3000").toString());
    expect(respuesta.status()).toBe(200);
  });
});

test.describe("Navegación del layout interno", () => {
  test("el menú lateral marca la vista activa y permite volver a temas", async ({ page }) => {
    await irA(page, "resumen");

    await expect(page.locator(".nav-item.active")).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".nav-item.active")).toContainText("Resumen");

    await page.locator("a", { hasText: "Volver a temas" }).click();
    await page.waitForURL(/\/temas$/);
    await expect(page.locator(".theme-grid")).toBeVisible();
  });
});
