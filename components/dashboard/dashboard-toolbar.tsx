"use client";

import { useRef } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { SheetsConfigPanel } from "./sheets-config-panel";
import { RotateCcw, Download, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardToolbar() {
  const {
    resetDemo,
    exportJSON,
    importCSV,
    sheetsConfig,
    saveToSheets,
    sheetsStatus,
    isEditMode,
  } = useDashboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-card p-3 shadow-sm">
      {isEditMode && <SheetsConfigPanel />}

      {isEditMode && sheetsConfig.mode === "sheets" && sheetsStatus.connected && (
        <Button
          variant="outline"
          size="sm"
          onClick={saveToSheets}
          className="gap-1.5 border-primary/20"
        >
          Guardar en Sheets
        </Button>
      )}

      <div className="flex-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportJSON}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exportar datos como JSON</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isEditMode && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDemo}
                  className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  <span className="hidden sm:inline">Restablecer</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Restablecer datos demo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-1">
            <Select
              onValueChange={(v) => {
                if (v === "links" || v === "temas") {
                  fileInputRef.current?.setAttribute("data-target", v);
                  fileInputRef.current?.click();
                }
              }}
            >
              <SelectTrigger className="h-8 w-auto gap-1.5 border-0 text-xs shadow-none hover:bg-secondary">
                <Upload className="size-3.5" />
                <SelectValue placeholder="Importar CSV" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="links">Links CSV</SelectItem>
                <SelectItem value="temas">Temas CSV</SelectItem>
              </SelectContent>
            </Select>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                const target =
                  (fileInputRef.current?.getAttribute("data-target") as
                    | "links"
                    | "temas") || "links";
                if (file) importCSV(file, target);
                e.target.value = "";
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
