"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { DollarSign, Pencil } from "lucide-react";

export function TotalInvertido() {
  const { data, updateKPI, isEditMode } = useDashboard();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function startEdit() {
    if (!isEditMode) return;
    setDraft(String(data.kpis.totalInvertido || 0));
    setEditing(true);
  }

  function commit() {
    const parsed = parseLocalNumber(draft);
    updateKPI("totalInvertido", parsed);
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-end">
      <div className="inline-flex items-center gap-3 rounded-md border-2 border-accent/40 bg-card px-5 py-3 shadow-sm">
        <div className="flex size-8 items-center justify-center rounded-sm bg-accent/15">
          <DollarSign className="size-4 text-accent-foreground" />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {"Total Invertido en Campa\u00f1a"}
          </span>

          {editing && isEditMode ? (
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-foreground">$</span>
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") setEditing(false);
                }}
                className="w-40 border-b-2 border-primary bg-transparent text-lg font-bold text-foreground outline-none font-serif"
                aria-label="Total invertido en campana"
              />
              <span className="text-xs text-muted-foreground">COP</span>
            </div>
          ) : isEditMode ? (
            <button
              onClick={startEdit}
              className="group flex items-center gap-2 text-left"
              aria-label="Editar total invertido"
            >
              <span className="text-lg font-bold text-foreground font-serif">
                {"$"}{formatNumber(data.kpis.totalInvertido || 0)}
              </span>
              <span className="text-xs text-muted-foreground">COP</span>
              <Pencil className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground font-serif">
                {"$"}{formatNumber(data.kpis.totalInvertido || 0)}
              </span>
              <span className="text-xs text-muted-foreground">COP</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
