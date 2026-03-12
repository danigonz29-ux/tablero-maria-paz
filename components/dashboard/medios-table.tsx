"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Radio, ChevronDown, ExternalLink } from "lucide-react";

export function MediosTable() {
  const {
    data,
    autoCalcMedios,
    setAutoCalcMedios,
    updateMedio,
    addMedio,
    removeMedio,
    isEditMode,
  } = useDashboard();
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [openMedios, setOpenMedios] = useState<Record<string, boolean>>({});

  const toggleMedio = (medio: string) => {
    setOpenMedios((prev) => ({ ...prev, [medio]: !prev[medio] }));
  };

  // Group links by medio for the dropdown listing
  const linksByMedio: Record<string, typeof data.links> = {};
  for (const link of data.links) {
    if (!linksByMedio[link.medio]) linksByMedio[link.medio] = [];
    linksByMedio[link.medio].push(link);
  }

  const colCount = autoCalcMedios ? 2 : 3;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          <Radio className="size-4 text-primary" />
          {"Medios de Difusi\u00f3n"}
        </CardTitle>
        {isEditMode && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="auto-calc-medios"
                className="whitespace-nowrap text-xs text-muted-foreground"
              >
                Auto calcular
              </Label>
              <Switch
                id="auto-calc-medios"
                checked={autoCalcMedios}
                onCheckedChange={setAutoCalcMedios}
              />
            </div>
            {!autoCalcMedios && (
              <Button
                variant="outline"
                size="sm"
                onClick={addMedio}
                className="gap-1.5 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="size-3" />
                Agregar
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  MEDIO
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  CANTIDAD
                </th>
                {!autoCalcMedios && <th className="w-12 px-2 py-3" />}
              </tr>
            </thead>
            <tbody>
              {data.medios.map((medio, i) => {
                const medioLinks = linksByMedio[medio.medio] || [];
                const isOpen = openMedios[medio.medio] ?? false;
                const hasLinks = medioLinks.length > 0;

                return (
                  <MedioRowGroup
                    key={`${medio.medio}-${i}`}
                    medio={medio}
                    index={i}
                    medioLinks={medioLinks}
                    isOpen={isOpen}
                    hasLinks={hasLinks}
                    toggleMedio={toggleMedio}
                    autoCalcMedios={autoCalcMedios}
                    editingCell={editingCell}
                    setEditingCell={setEditingCell}
                    updateMedio={updateMedio}
                    removeMedio={removeMedio}
                    colCount={colCount}
                    isEditMode={isEditMode}
                  />
                );
              })}
              {data.medios.length === 0 && (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    {autoCalcMedios
                      ? "Los medios se calculan desde los links."
                      : "No hay medios. Haz clic en Agregar para empezar."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---- Sub-component for each medio row + expandable links ---- */
import type { MedioRow, LinkRow } from "@/lib/types";

interface MedioRowGroupProps {
  medio: MedioRow;
  index: number;
  medioLinks: LinkRow[];
  isOpen: boolean;
  hasLinks: boolean;
  toggleMedio: (medio: string) => void;
  autoCalcMedios: boolean;
  editingCell: string | null;
  setEditingCell: (v: string | null) => void;
  updateMedio: (index: number, field: keyof MedioRow, value: string | number) => void;
  removeMedio: (index: number) => void;
  colCount: number;
  isEditMode: boolean;
}

function MedioRowGroup({
  medio,
  index: i,
  medioLinks,
  isOpen,
  hasLinks,
  toggleMedio,
  autoCalcMedios,
  editingCell,
  setEditingCell,
  updateMedio,
  removeMedio,
  colCount,
  isEditMode,
}: MedioRowGroupProps) {
  return (
    <>
      <tr className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30">
        {/* MEDIO name with expand button */}
        <td className="px-4 py-2.5">
          <div className="flex items-center gap-2">
            {hasLinks ? (
              <button
                onClick={() => toggleMedio(medio.medio)}
                className="flex size-5 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={`Expandir ${medio.medio}`}
                aria-expanded={isOpen}
              >
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            ) : (
              <span className="size-5" />
            )}

            {!autoCalcMedios && editingCell === `mn-${i}` && isEditMode ? (
              <Input
                autoFocus
                className="h-7 text-xs"
                defaultValue={medio.medio}
                onBlur={(e) => {
                  updateMedio(i, "medio", e.target.value);
                  setEditingCell(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateMedio(i, "medio", e.currentTarget.value);
                    setEditingCell(null);
                  }
                }}
              />
            ) : (
              <button
                className={`text-left text-xs font-medium ${!autoCalcMedios ? "cursor-text hover:text-primary" : "cursor-default"}`}
                onClick={() =>
                  !autoCalcMedios && setEditingCell(`mn-${i}`)
                }
                disabled={autoCalcMedios}
              >
                {medio.medio || "Medio..."}
              </button>
            )}

            {hasLinks && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-primary">
                {medioLinks.length}
              </span>
            )}
          </div>
        </td>

        {/* CANTIDAD */}
        <td className="px-4 py-2.5 text-right">
          {!autoCalcMedios && editingCell === `mc-${i}` && isEditMode ? (
            <Input
              autoFocus
              className="ml-auto h-7 w-24 text-right text-xs"
              defaultValue={formatNumber(medio.cantidad)}
              onBlur={(e) => {
                updateMedio(i, "cantidad", parseLocalNumber(e.target.value));
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateMedio(i, "cantidad", parseLocalNumber(e.currentTarget.value));
                  setEditingCell(null);
                }
              }}
            />
          ) : (
            <button
              className={`inline-block rounded-md px-2 py-0.5 font-sans text-sm font-semibold tabular-nums transition-colors ${!autoCalcMedios ? "hover:bg-secondary cursor-text" : "cursor-default"}`}
              onClick={() =>
                !autoCalcMedios && setEditingCell(`mc-${i}`)
              }
              disabled={autoCalcMedios}
            >
              {formatNumber(medio.cantidad)}
            </button>
          )}
        </td>

        {/* Delete (manual mode + edit mode) */}
        {!autoCalcMedios && isEditMode && (
          <td className="px-2 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeMedio(i)}
              className="size-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Eliminar medio</span>
            </Button>
          </td>
        )}
      </tr>

      {/* Expandable links dropdown listing */}
      {hasLinks && isOpen && (
        <tr>
          <td colSpan={colCount} className="p-0">
            <div className="border-b border-border/30 bg-secondary/20 px-4 py-3">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.1em] text-muted-foreground/70 uppercase">
                {"Links en " + medio.medio}
              </p>
              <div className="flex flex-col gap-1.5">
                {medioLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 rounded-md bg-card px-3 py-2 text-xs shadow-sm"
                  >
                    <ExternalLink className="size-3 shrink-0 text-primary/60" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 truncate text-primary/80 underline-offset-2 hover:text-primary hover:underline"
                    >
                      {link.url || "Sin URL"}
                    </a>
                    <span className="shrink-0 font-semibold tabular-nums text-foreground">
                      {formatNumber(link.cantidad)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
