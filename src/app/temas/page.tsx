import { LogoUcundinamarca } from "@/components/brand/LogoUcundinamarca";
import { TarjetaTema } from "@/features/temas/TarjetaTema";
import { TEMAS } from "@/features/temas/temas";

/** Layout 1 — Portada de temas (regla layouts §3–5). */
export default function PortadaPage() {
  return (
    <>
      <header className="topbar">
        <LogoUcundinamarca variant="horizontal" tono="negro" height={80} />
        <div className="spacer" />
        <div className="top-actions">
          <button className="icon-btn" type="button" aria-label="Ayuda">
            ?
          </button>
        </div>
      </header>

      <div className="hero">
        <div className="eyebrow">Portal de análisis institucional</div>
        <h1>Tableros de gestión de la Universidad</h1>
        <p>
          Explore los tableros de indicadores por área. Cada tema reúne sus reportes, gráficas y
          seguimiento en un espacio de trabajo dedicado, con datos actualizados por periodo académico.
        </p>
        <div className="hero-meta">
          <div className="m">
            <b>{TEMAS.length}</b>
            <span>temas en el portal</span>
          </div>
          <div className="m">
            <b>2026-I</b>
            <span>periodo vigente</span>
          </div>
          <div className="m">
            <b>7</b>
            <span>sedes integradas</span>
          </div>
        </div>
      </div>

      <div className="section-head">
        <h2>Temas disponibles</h2>
        <span>Seleccione un tema para abrir su espacio de trabajo</span>
      </div>

      <div className="theme-grid">
        {TEMAS.map((tema) => (
          <TarjetaTema key={tema.id} tema={tema} />
        ))}
      </div>

      <footer className="portada-foot">
        <LogoUcundinamarca variant="horizontal" tono="negro" height={80} />
        <span>Oficina de Planeación · Datos con fines demostrativos</span>
      </footer>
    </>
  );
}
