"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import type {
  DashboardData,
  KPIs,
  LinkRow,
  TemaRow,
  MedioRow,
  PautaMetaRow,
  ContactoDirectoData,
  ConclusionRow,
  SheetsConfig,
  SheetsStatus,
  DataSourceMode,
  MedioOption,
  TipoResultado,
  FrecuenciaOption,
} from "./types";
import { MEDIOS_OPTIONS, TIPO_RESULTADO_OPTIONS } from "./types";
import { DEMO_DATA } from "./demo-data";

// ---- Sheets config helpers (uses localStorage) ----
function loadSheetsConfig(): SheetsConfig {
  if (typeof window === "undefined")
    return {
      spreadsheetId: "",
      mode: "local",
      tabKpis: "kpis",
      tabLinks: "links",
      tabTemas: "temas",
      tabMedios: "medios",
    };
  try {
    const raw = localStorage.getItem("sl_sheets_config");
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    spreadsheetId: "",
    mode: "local",
    tabKpis: "kpis",
    tabLinks: "links",
    tabTemas: "temas",
    tabMedios: "medios",
  };
}

function saveSheetsConfig(cfg: SheetsConfig) {
  if (typeof window !== "undefined")
    localStorage.setItem("sl_sheets_config", JSON.stringify(cfg));
}

// ---- Parse sheets rows into DashboardData ----
function parseSheetData(
  raw: Record<string, string[][]>,
  config: SheetsConfig
): Partial<DashboardData> {
  const result: Partial<DashboardData> = {};

  // KPIs tab: key, value
  const kpiRows = raw[config.tabKpis];
  if (kpiRows && kpiRows.length > 1) {
    const map: Record<string, string> = {};
    for (let i = 1; i < kpiRows.length; i++) {
      const [key, val] = kpiRows[i];
      if (key) map[key] = val || "0";
    }
    result.kpis = {
      cantidad: Number(map["cantidad"] || 0),
      meGusta: Number(map["meGusta"] || 0),
      compartido: Number(map["compartido"] || 0),
      comentario: Number(map["comentario"] || 0),
      seguidoresCaptados: Number(map["seguidoresCaptados"] || 0),
      totalInvertido: Number(map["totalInvertido"] || 0),
      ondaExpansiva: Number(map["ondaExpansiva"] || 0),
      ondaFactor: Number(map["ondaFactor"] || 3.5),
      ondaAuto: map["ondaAuto"] === "true",
    };
  }

  // Links tab: id, publicacion, url, medio, cantidad, engagementRate
  const linkRows = raw[config.tabLinks];
  if (linkRows && linkRows.length > 1) {
    result.links = linkRows.slice(1).map((r) => ({
      id: r[0] || crypto.randomUUID(),
      publicacion: r[1] || "",
      url: r[2] || "",
      medio: (MEDIOS_OPTIONS.includes(r[3] as MedioOption) ? r[3] : "Otro") as MedioOption,
      cantidad: Number(r[4] || 0),
      engagementRate: Number(r[5] || 0),
    }));
  }

  // Temas tab: id, tema, cantidad
  const temaRows = raw[config.tabTemas];
  if (temaRows && temaRows.length > 1) {
    result.temas = temaRows.slice(1).map((r) => ({
      id: r[0] || crypto.randomUUID(),
      tema: r[1] || "",
      cantidad: Number(r[2] || 0),
    }));
  }

  // Medios tab: medio, cantidad
  const medioRows = raw[config.tabMedios];
  if (medioRows && medioRows.length > 1) {
    result.medios = medioRows.slice(1).map((r) => ({
      medio: r[0] || "",
      cantidad: Number(r[1] || 0),
    }));
  }

  return result;
}

// ---- Serialize DashboardData to sheet rows ----
function toSheetRows(data: DashboardData, config: SheetsConfig): Record<string, string[][]> {
  const kpiRows: string[][] = [
    ["key", "value"],
    ["cantidad", String(data.kpis.cantidad)],
    ["meGusta", String(data.kpis.meGusta)],
    ["compartido", String(data.kpis.compartido)],
    ["comentario", String(data.kpis.comentario)],
    ["seguidoresCaptados", String(data.kpis.seguidoresCaptados)],
    ["totalInvertido", String(data.kpis.totalInvertido)],
    ["ondaExpansiva", String(data.kpis.ondaExpansiva)],
    ["ondaFactor", String(data.kpis.ondaFactor)],
    ["ondaAuto", String(data.kpis.ondaAuto)],
  ];

  const linkRows: string[][] = [
    ["id", "publicacion", "url", "medio", "cantidad", "engagementRate"],
    ...data.links.map((l) => [l.id, l.publicacion || "", l.url, l.medio, String(l.cantidad), String(l.engagementRate || 0)]),
  ];

  const temaRows: string[][] = [
    ["id", "tema", "cantidad"],
    ...data.temas.map((t) => [t.id, t.tema, String(t.cantidad)]),
  ];

  const medioRows: string[][] = [
    ["medio", "cantidad"],
    ...data.medios.map((m) => [m.medio, String(m.cantidad)]),
  ];

  return {
    [config.tabKpis]: kpiRows,
    [config.tabLinks]: linkRows,
    [config.tabTemas]: temaRows,
    [config.tabMedios]: medioRows,
  };
}

// ---- Calculate derived values ----
function recalculate(data: DashboardData, autoCalcMedios: boolean): DashboardData {
  const cantidad = data.kpis.cantidad;
  const ondaExpansiva = data.kpis.ondaAuto
    ? Math.round(cantidad * data.kpis.ondaFactor)
    : data.kpis.ondaExpansiva;

  let medios = data.medios;
  if (autoCalcMedios) {
    const map: Record<string, number> = {};
    for (const l of data.links) {
      map[l.medio] = (map[l.medio] || 0) + l.cantidad;
    }
    medios = Object.entries(map).map(([medio, cantidad]) => ({ medio, cantidad }));
  }

  return {
    ...data,
    kpis: { ...data.kpis, cantidad, ondaExpansiva },
    medios,
    pautaMeta: data.pautaMeta || [],
    contactoDirecto: data.contactoDirecto || DEMO_DATA.contactoDirecto,
    conclusiones: data.conclusiones || DEMO_DATA.conclusiones || [],
  };
}

// ---- Context type ----
interface DashboardContextType {
  data: DashboardData;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  sheetsConfig: SheetsConfig;
  sheetsStatus: SheetsStatus;
  autoCalcMedios: boolean;
  autoSave: boolean;
  setAutoSave: (v: boolean) => void;
  setAutoCalcMedios: (v: boolean) => void;
  setMode: (m: DataSourceMode) => void;
  setSheetsConfig: (cfg: Partial<SheetsConfig>) => void;
  connectSheets: () => Promise<void>;
  syncNow: () => Promise<void>;
  saveToSheets: () => Promise<void>;
  // Data mutations
  updateKPI: (key: keyof KPIs, value: number | boolean) => void;
  addLink: (linkData?: Partial<LinkRow>) => void;
  updateLink: (id: string, field: keyof LinkRow, value: string | number) => void;
  removeLink: (id: string) => void;
  addTema: (tema?: string, cantidad?: number) => void;
  updateTema: (id: string, field: keyof TemaRow, value: string | number) => void;
  removeTema: (id: string) => void;
  updateMedio: (index: number, field: keyof MedioRow, value: string | number) => void;
  addMedio: () => void;
  removeMedio: (index: number) => void;
  addPautaMeta: () => void;
  updatePautaMeta: (id: string, field: keyof PautaMetaRow, value: string | number) => void;
  removePautaMeta: (id: string) => void;
  updateContactoDirecto: (updates: Partial<ContactoDirectoData>) => void;
  addConclusion: (texto?: string) => void;
  updateConclusion: (id: string, texto: string) => void;
  removeConclusion: (id: string) => void;
  resetDemo: () => void;
  exportJSON: () => void;
  importCSV: (file: File, target: "links" | "temas") => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Check URL for edit mode - defaults to false (read-only for shared links)
  const [isEditMode, setIsEditMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("edit") === "true";
  });
  const [autoCalcMedios, setAutoCalcMedios] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [sheetsConfig, _setSheetsConfig] = useState<SheetsConfig>(loadSheetsConfig);
  const [sheetsStatus, setSheetsStatus] = useState<SheetsStatus>({
    connected: false,
    error: null,
    loading: false,
  });

  // Initialize with demo data, recalculated
  const [data, setData] = useState<DashboardData>(() =>
    recalculate({ ...DEMO_DATA, medios: [], pautaMeta: DEMO_DATA.pautaMeta || [] }, true)
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSheetsConfig = useCallback((partial: Partial<SheetsConfig>) => {
    _setSheetsConfig((prev) => {
      const next = { ...prev, ...partial };
      saveSheetsConfig(next);
      return next;
    });
  }, []);

  const setMode = useCallback(
    (m: DataSourceMode) => {
      setSheetsConfig({ mode: m });
    },
    [setSheetsConfig]
  );

  // Mutate data with auto-recalculate
  const mutate = useCallback(
    (fn: (prev: DashboardData) => DashboardData) => {
      setData((prev) => {
        const next = fn(prev);
        return recalculate(next, autoCalcMedios);
      });
    },
    [autoCalcMedios]
  );

  // ---- Sheets operations ----
  const connectSheets = useCallback(async () => {
    setSheetsStatus({ connected: false, error: null, loading: true });
    try {
      const tabs = [
        sheetsConfig.tabKpis,
        sheetsConfig.tabLinks,
        sheetsConfig.tabTemas,
        sheetsConfig.tabMedios,
      ].join(",");

      const res = await fetch(
        `/api/sheets?spreadsheetId=${encodeURIComponent(sheetsConfig.spreadsheetId)}&tabs=${encodeURIComponent(tabs)}`
      );
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Connection error");

      const parsed = parseSheetData(json.data, sheetsConfig);
      setData((prev) =>
        recalculate(
          {
            kpis: parsed.kpis || prev.kpis,
            links: parsed.links || prev.links,
            temas: parsed.temas || prev.temas,
            medios: parsed.medios || prev.medios,
            pautaMeta: prev.pautaMeta,
          },
          autoCalcMedios
        )
      );

      setSheetsStatus({ connected: true, error: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSheetsStatus({ connected: false, error: message, loading: false });
    }
  }, [sheetsConfig, autoCalcMedios]);

  const saveToSheets = useCallback(async () => {
    if (sheetsConfig.mode !== "sheets" || !sheetsStatus.connected) return;
    setSheetsStatus((p) => ({ ...p, loading: true }));
    try {
      const rows = toSheetRows(data, sheetsConfig);
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: sheetsConfig.spreadsheetId,
          updates: rows,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Write error");
      setSheetsStatus((p) => ({ ...p, loading: false, error: null }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSheetsStatus((p) => ({ ...p, loading: false, error: message }));
    }
  }, [data, sheetsConfig, sheetsStatus.connected]);

  const syncNow = connectSheets;

  // Autosave debounce
  useEffect(() => {
    if (!autoSave || sheetsConfig.mode !== "sheets" || !sheetsStatus.connected) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveToSheets();
    }, 4000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, autoSave, sheetsConfig.mode, sheetsStatus.connected, saveToSheets]);

  // ---- Data mutations ----
  const updateKPI = useCallback(
    (key: keyof KPIs, value: number | boolean) => {
      mutate((prev) => ({
        ...prev,
        kpis: { ...prev.kpis, [key]: value },
      }));
    },
    [mutate]
  );

  const addLink = useCallback((linkData?: Partial<LinkRow>) => {
    mutate((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        { 
          id: crypto.randomUUID(), 
          publicacion: linkData?.publicacion || "", 
          url: linkData?.url || "", 
          medio: linkData?.medio || "Otro" as MedioOption, 
          cantidad: linkData?.cantidad || 0, 
          engagementRate: linkData?.engagementRate || 0 
        },
      ],
    }));
  }, [mutate]);

  const updateLink = useCallback(
    (id: string, field: keyof LinkRow, value: string | number) => {
      mutate((prev) => ({
        ...prev,
        links: prev.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      }));
    },
    [mutate]
  );

  const removeLink = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        links: prev.links.filter((l) => l.id !== id),
      }));
    },
    [mutate]
  );

  const addTema = useCallback((tema?: string, cantidad?: number) => {
    mutate((prev) => ({
      ...prev,
      temas: [
        ...prev.temas,
        { id: crypto.randomUUID(), tema: tema || "", cantidad: cantidad || 0 },
      ],
    }));
  }, [mutate]);

  const updateTema = useCallback(
    (id: string, field: keyof TemaRow, value: string | number) => {
      mutate((prev) => ({
        ...prev,
        temas: prev.temas.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
      }));
    },
    [mutate]
  );

  const removeTema = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        temas: prev.temas.filter((t) => t.id !== id),
      }));
    },
    [mutate]
  );

  const updateMedio = useCallback(
    (index: number, field: keyof MedioRow, value: string | number) => {
      mutate((prev) => ({
        ...prev,
        medios: prev.medios.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
      }));
    },
    [mutate]
  );

  const addMedio = useCallback(() => {
    mutate((prev) => ({
      ...prev,
      medios: [...prev.medios, { medio: "", cantidad: 0 }],
    }));
  }, [mutate]);

  const removeMedio = useCallback(
    (index: number) => {
      mutate((prev) => ({
        ...prev,
        medios: prev.medios.filter((_, i) => i !== index),
      }));
    },
    [mutate]
  );

  const addPautaMeta = useCallback(() => {
    mutate((prev) => ({
      ...prev,
      pautaMeta: [
        ...prev.pautaMeta,
        {
          id: crypto.randomUUID(),
          campana: "",
          resultados: 0,
          tipoResultado: "Alcance" as TipoResultado,
          costoPorResultado: 0,
          importeGastado: 0,
          impresiones: 0,
          alcance: 0,
        },
      ],
    }));
  }, [mutate]);

  const updatePautaMeta = useCallback(
    (id: string, field: keyof PautaMetaRow, value: string | number) => {
      mutate((prev) => ({
        ...prev,
        pautaMeta: prev.pautaMeta.map((p) =>
          p.id === id ? { ...p, [field]: value } : p
        ),
      }));
    },
    [mutate]
  );

  const removePautaMeta = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        pautaMeta: prev.pautaMeta.filter((p) => p.id !== id),
      }));
    },
    [mutate]
  );

  const updateContactoDirecto = useCallback(
    (updates: Partial<ContactoDirectoData>) => {
      mutate((prev) => ({
        ...prev,
        contactoDirecto: {
          ...prev.contactoDirecto,
          ...updates,
          sms: { ...prev.contactoDirecto.sms, ...(updates.sms || {}) },
          llamadas: { ...prev.contactoDirecto.llamadas, ...(updates.llamadas || {}) },
        },
      }));
    },
    [mutate]
  );

  const addConclusion = useCallback(
    (texto?: string) => {
      mutate((prev) => ({
        ...prev,
        conclusiones: [
          ...prev.conclusiones,
          { id: crypto.randomUUID(), texto: texto || "" },
        ],
      }));
    },
    [mutate]
  );

  const updateConclusion = useCallback(
    (id: string, texto: string) => {
      mutate((prev) => ({
        ...prev,
        conclusiones: prev.conclusiones.map((c) =>
          c.id === id ? { ...c, texto } : c
        ),
      }));
    },
    [mutate]
  );

  const removeConclusion = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        conclusiones: prev.conclusiones.filter((c) => c.id !== id),
      }));
    },
    [mutate]
  );

  const resetDemo = useCallback(() => {
    setData(recalculate({ ...DEMO_DATA, medios: [], pautaMeta: DEMO_DATA.pautaMeta || [] }, true));
    setAutoCalcMedios(true);
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "social-listening-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importCSV = useCallback(
    (file: File, target: "links" | "temas") => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim());
        if (lines.length < 2) return;

        if (target === "links") {
          const newLinks: LinkRow[] = lines.slice(1).map((line) => {
            const cols = line.split(",").map((c) => c.trim());
            return {
              id: crypto.randomUUID(),
              publicacion: cols[0] || "",
              url: cols[1] || "",
              medio: (MEDIOS_OPTIONS.includes(cols[2] as MedioOption)
                ? cols[2]
                : "Otro") as MedioOption,
              cantidad: Number(cols[3]) || 0,
              engagementRate: Number(cols[4]) || 0,
            };
          });
          mutate((prev) => ({ ...prev, links: [...prev.links, ...newLinks] }));
        } else {
          const newTemas: TemaRow[] = lines.slice(1).map((line) => {
            const cols = line.split(",").map((c) => c.trim());
            return {
              id: crypto.randomUUID(),
              tema: cols[0] || "",
              cantidad: Number(cols[1]) || 0,
            };
          });
          mutate((prev) => ({ ...prev, temas: [...prev.temas, ...newTemas] }));
        }
      };
      reader.readAsText(file);
    },
    [mutate]
  );

  // Recalculate when autoCalcMedios changes
  useEffect(() => {
    setData((prev) => recalculate(prev, autoCalcMedios));
  }, [autoCalcMedios]);

  return (
    <DashboardContext.Provider
      value={{
        data,
        isEditMode,
        setIsEditMode,
        sheetsConfig,
        sheetsStatus,
        autoCalcMedios,
        autoSave,
        setAutoSave,
        setAutoCalcMedios,
        setMode,
        setSheetsConfig,
        connectSheets,
        syncNow,
        saveToSheets,
        updateKPI,
        addLink,
        updateLink,
        removeLink,
        addTema,
        updateTema,
        removeTema,
        updateMedio,
        addMedio,
        removeMedio,
        addPautaMeta,
        updatePautaMeta,
        removePautaMeta,
        updateContactoDirecto,
        addConclusion,
        updateConclusion,
        removeConclusion,
        resetDemo,
        exportJSON,
        importCSV,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
