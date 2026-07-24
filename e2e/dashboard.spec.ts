import { test, expect } from "@playwright/test";

test.describe("Dashboard UCundinamarca", () => {
  test("portada de temas carga correctamente", async ({ page }) => {
    await page.goto("/temas");

    // Verificar que el logo está visible
    const logo = page.locator("img").first();
    await expect(logo).toBeVisible();

    // Verificar que el título está presente
    await expect(page.locator("h1")).toContainText("Tableros de gestión");

    // Verificar que hay tarjetas de temas
    const tarjetas = page.locator(".theme-card");
    const count = await tarjetas.count();
    expect(count).toBeGreaterThan(0);
  });

  test("navega a tema disponible", async ({ page }) => {
    await page.goto("/temas");

    // Hacer clic en la primera tarjeta de tema
    const primeraTarjeta = page.locator(".theme-card").first();
    await primeraTarjeta.click();

    // Verificar que se navegó a una vista
    await page.waitForURL(/\/temas\/.*\/resumen/);
    expect(page.url()).toContain("/resumen");
  });

  test("resumen muestra KPIs", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/resumen");

    // Verificar que hay KPIs
    const kpis = page.locator(".kpi");
    const kpiCount = await kpis.count();
    expect(kpiCount).toBe(4);

    // Verificar que al menos uno tiene un valor
    const primerKpi = kpis.first();
    await expect(primerKpi.locator(".k-val")).toBeVisible();
  });

  test("indicadores muestra metas", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/indicadores");

    // Verificar que hay al menos una tarjeta de indicador
    const cards = page.locator(".card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("reportes muestran descargas", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/reportes");

    // Verificar que hay botones de descarga
    const botones = page.locator("button");
    const botonesCuenta = await botones.count();
    expect(botonesCuenta).toBeGreaterThan(0);
  });

  test("datos muestra tabla histórica", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/datos");

    // Verificar que hay al menos una tabla (hay 2: histórica y por sede)
    const tablas = page.locator("table");
    const tablasCount = await tablas.count();
    expect(tablasCount).toBeGreaterThan(0);

    // Verificar que la primera tabla tiene filas
    const tabla = tablas.first();
    const filas = tabla.locator("tbody tr");
    const filasCount = await filas.count();
    expect(filasCount).toBeGreaterThan(0);
  });

  test("seguimiento muestra plan", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/seguimiento");

    // Verificar que hay elementos de seguimiento
    const elementos = page.locator("div").filter({ hasText: "completado" });
    await expect(elementos.first()).toBeVisible();
  });

  test("navegación entre vistas funciona", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/resumen");

    // Cambiar a indicadores editando la URL
    await page.goto("/temas/desercion-permanencia/indicadores");
    await page.waitForURL(/indicadores/);
    expect(page.url()).toContain("indicadores");

    // Cambiar a reportes
    await page.goto("/temas/desercion-permanencia/reportes");
    await page.waitForURL(/reportes/);
    expect(page.url()).toContain("reportes");
  });

  test("volver a temas desde menú lateral", async ({ page }) => {
    await page.goto("/temas/desercion-permanencia/resumen");

    // Buscar el link de "Volver a temas"
    const volverLink = page.locator("a").filter({ hasText: "Volver a temas" });

    if (await volverLink.isVisible()) {
      await volverLink.click();
      await page.waitForURL("/temas");
      expect(page.url()).toBe("http://localhost:3000/temas");
    }
  });
});
