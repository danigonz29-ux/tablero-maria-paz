"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, Zap, Share2, MessageCircle, UserPlus } from "lucide-react";

const KPI_CONFIG = [
  {
    key: "cantidad" as const,
    label: "CONTENIDOS APOYADOS",
    icon: Sprout,
    bgClass: "bg-[#DC2626]",
    textClass: "text-white",
    iconBg: "bg-white/15",
    description: "Total de contenidos apoyados",
  },
  {
    key: "meGusta" as const,
    label: "INTERACCIONES CAPTADAS",
    icon: Zap,
    bgClass: "bg-[#FACC15]",
    textClass: "text-[#7C2D12]",
    iconBg: "bg-[#7C2D12]/10",
    description: "Me gusta y reacciones",
  },
  {
    key: "compartido" as const,
    label: "COMPARTIDO",
    icon: Share2,
    bgClass: "bg-[#C084FC]",
    textClass: "text-white",
    iconBg: "bg-white/15",
    description: "Veces compartido",
  },
  {
    key: "comentario" as const,
    label: "COMENTARIOS",
    icon: MessageCircle,
    bgClass: "bg-[#7C2D12]",
    textClass: "text-white",
    iconBg: "bg-white/15",
    description: "Total comentarios",
  },
  {
    key: "seguidoresCaptados" as const,
    label: "SEGUIDORES CAPTADOS",
    icon: UserPlus,
    bgClass: "bg-[#DC2626]",
    textClass: "text-white",
    iconBg: "bg-white/15",
    description: "Nuevos seguidores",
  },
];

function EditableKPIValue({
  value,
  kpiKey,
  textClass,
}: {
  value: number;
  kpiKey: string;
  textClass: string;
}) {
  const { updateKPI, isEditMode } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleClick = () => {
    if (!isEditMode) return;
    setDraft(formatNumber(value));
    setEditing(true);
  };

  const commit = () => {
    const parsed = parseLocalNumber(draft);
    updateKPI(kpiKey as Parameters<typeof updateKPI>[0], parsed);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className={`w-full border-b-2 border-white/40 bg-transparent font-sans text-2xl font-bold tracking-tight outline-none ${textClass} lg:text-3xl`}
        aria-label="Editar valor"
      />
    );
  }

  if (!isEditMode) {
    return (
      <span className={`font-sans text-2xl font-bold tracking-tight ${textClass} lg:text-3xl`}>
        {formatNumber(value)}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer border-b border-dashed border-current/30 font-sans text-2xl font-bold tracking-tight ${textClass} transition-opacity hover:opacity-80 lg:text-3xl`}
      title="Clic para editar"
    >
      {formatNumber(value)}
    </button>
  );
}

export function KPICards() {
  const { data } = useDashboard();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {KPI_CONFIG.map(
        ({ key, label, icon: Icon, bgClass, textClass, iconBg, description }) => (
          <Card
            key={key}
            className={`border-0 ${bgClass} shadow-md transition-all hover:scale-[1.02] hover:shadow-lg`}
          >
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-bold tracking-[0.12em] ${textClass} uppercase opacity-80 leading-tight`}>
                  {label}
                </span>
                <div className={`flex size-7 items-center justify-center rounded-sm ${iconBg}`}>
                  <Icon className={`size-3.5 ${textClass}`} />
                </div>
              </div>
              <EditableKPIValue
                value={data.kpis[key] as number}
                kpiKey={key}
                textClass={textClass}
              />
              <span className={`text-[10px] ${textClass} opacity-60`}>
                {description}
              </span>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
