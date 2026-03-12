"use client";

import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

const EDITABLE_KPIS = [
  { key: "meGusta" as const, label: "Interacciones Captadas" },
  { key: "compartido" as const, label: "Compartido" },
  { key: "comentario" as const, label: "Comentarios" },
  { key: "seguidoresCaptados" as const, label: "Seguidores Captados" },
] as const;

export function EditDrawer() {
  const { data, updateKPI } = useDashboard();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
        >
          <Pencil className="size-3.5" />
          <span className="hidden sm:inline">Editar datos</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Editar KPIs</SheetTitle>
          <SheetDescription>
            Modifica los valores manualmente. Los Contenidos Apoyados se
            calculan desde los links.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Read-only: Contenidos Apoyados */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">
              Contenidos Apoyados (auto-calculado)
            </Label>
            <div className="rounded-lg bg-secondary px-3 py-2 text-sm font-semibold tabular-nums">
              {formatNumber(data.kpis.cantidad)}
            </div>
          </div>

          {/* Editable KPIs */}
          {EDITABLE_KPIS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`kpi-${key}`} className="text-sm font-medium">
                {label}
              </Label>
              <Input
                id={`kpi-${key}`}
                defaultValue={formatNumber(data.kpis[key] as number)}
                onBlur={(e) =>
                  updateKPI(key, parseLocalNumber(e.target.value))
                }
              />
            </div>
          ))}

          {/* Onda expansiva section */}
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <h3 className="mb-3 text-sm font-bold text-primary">
              Onda Expansiva
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Valor actual
                </Label>
                <div className="rounded-lg bg-card px-3 py-2 text-sm font-semibold tabular-nums">
                  {formatNumber(data.kpis.ondaExpansiva)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Factor multiplicador
                </Label>
                <Input
                  defaultValue={data.kpis.ondaFactor}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 0) updateKPI("ondaFactor", v);
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {data.kpis.ondaAuto
                  ? "Modo auto: contenidos apoyados x factor"
                  : "Modo manual: edita desde la seccion principal"}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
