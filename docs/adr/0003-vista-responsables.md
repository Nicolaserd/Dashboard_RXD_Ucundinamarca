# ADR-0003 — Vista «Responsables» en lugar de «Reportes»

**Estado:** Aceptada · 2026-08-13

## Contexto

El layout interno tenía cinco vistas: Resumen, Indicadores, **Reportes**, Datos y Seguimiento. La
vista Reportes mostraba tarjetas de informes descargables (PDF/XLSX) que formaban parte de los datos
de demostración.

Los libros de seguimiento **no contienen reportes descargables**. Mantener la vista habría exigido
inventar archivos o dejar botones de descarga que no descargan nada.

En cambio, los datos sí contienen una dimensión sin explotar y con valor de gestión: el **área
responsable** de cada OM, presente en el campo `Responsable` de los cinco libros.

## Decisión

Reemplazar la vista `reportes/` por `responsables/`, con el mismo patrón de carpeta física
independiente. La vista muestra el avance promedio por área institucional, la carga y el cierre por
área, y el texto literal del campo `Responsable` para conservar la trazabilidad hacia el libro de
origen.

## Alternativas consideradas

- **Conservar «Reportes» con botones inertes.** Descartada: una vista que promete descargas que no
  existen desinforma.
- **Conservar la ruta `reportes/` y solo cambiar la etiqueta a «Responsables».** Descartada: una URL
  que no corresponde a su contenido envejece mal y confunde al enlazar.
- **Generar informes en PDF desde la aplicación.** Descartada por alcance: es una funcionalidad
  distinta, no una vista de tablero. Puede añadirse después como sexta vista sin tocar lo demás.

## Consecuencias

- La ruta `/temas/:temaId/reportes` **deja de existir**; la nueva es `/temas/:temaId/responsables`.
  Los enlaces guardados a la ruta anterior devolverán 404.
- El área responsable pasa a ser una de las tres dimensiones de filtro del tablero, disponible desde
  cualquier vista.
- El campo `Responsable` es texto libre con 95 redacciones distintas, así que la vista se apoya en
  las áreas canónicas que deriva el ETL. Sus límites están documentados en
  [datos.md §2](../datos.md#áreas-responsables).
