"use client";

import { DashboardProvider } from "@/lib/dashboard-context";
import { KPICards } from "./kpi-cards";
import { OndaExpansiva } from "./onda-expansiva";
import { MediosPieChart } from "./medios-pie-chart";
import { LinksTable } from "./links-table";
import { TemasTable } from "./temas-table";
import { MediosTable } from "./medios-table";
import { DashboardToolbar } from "./dashboard-toolbar";
import { ContactoDirecto } from "./contacto-directo";
import { ConclusionesTable } from "./conclusiones-table";
import { EditModePanel } from "./edit-mode-panel";
import { EditModeBanner } from "./edit-mode-banner";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Campaign Header - bold red with yellow L100 badge */}
      <header className="sticky top-0 z-40 bg-primary shadow-lg">
        {/* Decorative yellow stripe at very top */}
        <div className="h-1 bg-accent" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            {/* MP Badge - yellow square like the campaign */}
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center bg-accent text-sm font-bold text-accent-foreground">
                MP
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-wide text-primary-foreground uppercase">
                  {"Maria Paz"}
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-accent">
                  L100
                </span>
              </div>
            </div>
            <div className="hidden h-7 w-px bg-primary-foreground/20 sm:block" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-wide text-primary-foreground uppercase">
                {"Campa\u00f1a Alterna"}
              </h1>
              <p className="text-[10px] tracking-wide text-primary-foreground/60 uppercase">
                Monitoreo de impacto
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-[10px] font-bold tracking-widest text-primary-foreground/50 uppercase md:flex">
              <span>El Camino</span>
              <span className="text-accent">{"/"}</span>
              <span>{"Unete"}</span>
              <span className="text-accent">{"/"}</span>
              <span>Prensa</span>
            </div>
            <EditModePanel />
          </div>
        </div>
      </header>

      {/* Edit Mode Banner */}
      <EditModeBanner />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Campaign tagline strip */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-0.5 flex-1 bg-primary/15" />
          <span className="rounded-sm bg-primary/8 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            {"Caminantes \u2014 Campa\u00f1a Alterna"}
          </span>
          <div className="h-0.5 flex-1 bg-primary/15" />
        </div>

        {/* Toolbar */}
        <div className="mb-8">
          <DashboardToolbar />
        </div>

        {/* KPI Cards */}
        <section className="mb-8" aria-label="Indicadores clave">
          <KPICards />
        </section>

        {/* Onda Expansiva + Pie Chart */}
        <section
          className="mb-8 grid gap-6 lg:grid-cols-2"
          aria-label="Onda expansiva y medios"
        >
          <OndaExpansiva />
          <MediosPieChart />
        </section>

        {/* Links Table */}
        <section className="mb-8" aria-label="Tabla de links">
          <LinksTable />
        </section>

        {/* Medios Table */}
        <section className="mb-8" aria-label="Medios de difusion">
          <MediosTable />
        </section>

        {/* Contacto Directo */}
        <section className="mb-8" aria-label="Contacto Directo">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-0.5 flex-1 bg-accent/30" />
            <span className="rounded-sm bg-accent/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-accent-foreground/70 uppercase">
              {"Contacto Directo"}
            </span>
            <div className="h-0.5 flex-1 bg-accent/30" />
          </div>
          <ContactoDirecto />
        </section>

        {/* Temas */}
        <section className="mb-8" aria-label="Temas">
          <TemasTable />
        </section>

        {/* Conclusiones Generales */}
        <section className="mb-8" aria-label="Conclusiones generales">
          <ConclusionesTable />
        </section>
      </main>

      {/* Footer - maroon/dark red strip */}
      <footer className="border-t-4 border-accent bg-primary py-6">
        <div className="mx-auto flex max-w-7xl items-end justify-between px-4 sm:px-6">
          {/* LevelUp logo left */}
          <div className="flex-shrink-0 overflow-hidden rounded-md bg-white/90 px-2 py-1">
            <img
              src="/images/levelup-logo.png"
              alt="LevelUp SocialTech Services - Powered by GK"
              className="h-8 w-auto object-contain"
            />
          </div>
          {/* Campaign text center */}
          <div className="text-center">
            <p className="text-sm font-bold tracking-wide text-primary-foreground uppercase">
              {"El camino es la cultura"}
            </p>
            <p className="mt-1 text-[10px] tracking-widest text-primary-foreground/50 uppercase">
              {"L 100 \u00B7 Maria Paz Gaviria \u00B7 Senado"} {new Date().getFullYear()}
            </p>
          </div>
          {/* Spacer for balance */}
          <div className="hidden w-24 flex-shrink-0 sm:block" />
        </div>
      </footer>
    </div>
  );
}

export function SocialListeningDashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
