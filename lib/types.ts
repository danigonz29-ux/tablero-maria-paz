// Social Listening Dashboard Types

export const MEDIOS_OPTIONS = [
  "Facebook",
  "TikTok",
  "Instagram",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Otro",
] as const;

export type MedioOption = (typeof MEDIOS_OPTIONS)[number];

export interface LinkRow {
  id: string;
  publicacion: string;
  url: string;
  medio: MedioOption;
  cantidad: number;
  engagementRate: number; // percentage (0-100)
}

export interface TemaRow {
  id: string;
  tema: string;
  cantidad: number;
}

export interface MedioRow {
  medio: string;
  cantidad: number;
}

export interface KPIs {
  cantidad: number;       // "Contenidos Apoyados"
  meGusta: number;        // "Interacciones Captadas"
  compartido: number;
  comentario: number;
  seguidoresCaptados: number; // NEW: "Seguidores Captados"
  ondaExpansiva: number;
  ondaFactor: number;
  ondaAuto: boolean;
  totalInvertido: number; // Total invertido en campana (COP)
}

export const TIPO_RESULTADO_OPTIONS = [
  "Alcance",
  "Visitas al perfil y a la pagina",
  "Visitas al perfil de Instagram",
  "Costo por visita",
  "Costo por visita al perfil",
  "Otro",
] as const;

export type TipoResultado = (typeof TIPO_RESULTADO_OPTIONS)[number];

export interface PautaMetaRow {
  id: string;
  campana: string;
  resultados: number;
  tipoResultado: TipoResultado;
  costoPorResultado: number;
  importeGastado: number;
  impresiones: number;
  alcance: number;
}

export type FrecuenciaOption = "Diario" | "Interdiario" | "Semanal" | "Mensual";

export interface ContactoDirectoData {
  diasCampana: number;
  sms: {
    enviosDiarios: number;
    frecuencia: FrecuenciaOption;
    costoUnitario: number;
  };
  llamadas: {
    llamadasDiarias: number;
    frecuencia: FrecuenciaOption;
    costoUnitario: number;
  };
}

export interface ConclusionRow {
  id: string;
  texto: string;
}

export interface DashboardData {
  kpis: KPIs;
  links: LinkRow[];
  temas: TemaRow[];
  medios: MedioRow[];
  pautaMeta: PautaMetaRow[];
  contactoDirecto: ContactoDirectoData;
  conclusiones: ConclusionRow[];
}

export type DataSourceMode = "local" | "sheets";

export interface SheetsConfig {
  spreadsheetId: string;
  mode: DataSourceMode;
  tabKpis: string;
  tabLinks: string;
  tabTemas: string;
  tabMedios: string;
}

export interface SheetsStatus {
  connected: boolean;
  error: string | null;
  loading: boolean;
}
