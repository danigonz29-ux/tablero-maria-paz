"use client";

import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber } from "@/lib/number-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function OndaExpansiva() {
  const { data } = useDashboard();

  return (
    <Card className="relative overflow-hidden border-0 shadow-md">
      {/* Decorative elements matching campaign style */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full border-4 border-accent/20" />
      <div className="pointer-events-none absolute -right-2 -top-2 size-16 rounded-full border-2 border-primary/15" />
      {/* Yellow accent bar at top */}
      <div className="h-1 bg-accent" />

      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
          <div className="flex size-6 items-center justify-center bg-accent">
            <Zap className="size-3.5 text-accent-foreground" />
          </div>
          Onda Expansiva
        </CardTitle>
      </CardHeader>
      <CardContent className="relative flex flex-col gap-5">
        <div className="text-center">
          <span className="font-serif text-5xl font-bold tracking-tight text-primary lg:text-6xl">
            {formatNumber(data.kpis.ondaExpansiva)}
          </span>
          <p className="mt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Alcance estimado total
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {data.kpis.ondaAuto
            ? `Apoyados: ${formatNumber(data.kpis.cantidad)} x ${data.kpis.ondaFactor} = ${formatNumber(data.kpis.ondaExpansiva)}`
            : "Modo manual"}
        </p>
      </CardContent>
    </Card>
  );
}
