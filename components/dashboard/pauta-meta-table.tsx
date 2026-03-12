"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { TIPO_RESULTADO_OPTIONS } from "@/lib/types";
import type { PautaMetaRow, TipoResultado } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Trash2, Megaphone, DollarSign, ChevronDown, ChevronUp } from "lucide-react";

function NumericCell({
  value,
  onChange,
  prefix,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  if (editing) {
    return (
      <Input
        autoFocus
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          onChange(parseLocalNumber(raw));
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(parseLocalNumber(raw));
            setEditing(false);
          }
          if (e.key === "Escape") setEditing(false);
        }}
        className="h-7 w-24 border-accent/30 bg-card text-right font-mono text-xs text-card-foreground focus-visible:ring-accent"
      />
    );
  }

  return (
    <button
      onClick={() => {
        setRaw(String(value));
        setEditing(true);
      }}
      className="cursor-text rounded px-1.5 py-0.5 text-right font-mono text-xs text-card-foreground tabular-nums transition-colors hover:bg-accent/10"
    >
      {prefix}
      {value === 0 ? "\u2014" : formatNumber(value)}
    </button>
  );
}

function CampaignNameCell({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  if (editing) {
    return (
      <Input
        autoFocus
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          onChange(raw);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(raw);
            setEditing(false);
          }
          if (e.key === "Escape") setEditing(false);
        }}
        className="h-7 w-full border-accent/30 bg-card text-xs text-card-foreground focus-visible:ring-accent"
      />
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              setRaw(value);
              setEditing(true);
            }}
            className="max-w-[220px] cursor-text truncate rounded px-1.5 py-0.5 text-left text-xs font-medium text-primary transition-colors hover:bg-accent/10"
          >
            {value || "Sin nombre"}
          </button>
        </TooltipTrigger>
        {value.length > 28 && (
          <TooltipContent
            side="top"
            className="max-w-xs border-border bg-popover text-popover-foreground"
          >
            <p className="text-xs">{value}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function PautaMetaTable() {
  const { data, addPautaMeta, updatePautaMeta, removePautaMeta } = useDashboard();
  const [expanded, setExpanded] = useState(true);

  // Totals
  const totals = data.pautaMeta.reduce(
    (acc, row) => ({
      resultados: acc.resultados + row.resultados,
      importeGastado: acc.importeGastado + row.importeGastado,
      impresiones: acc.impresiones + row.impresiones,
      alcance: acc.alcance + row.alcance,
    }),
    { resultados: 0, importeGastado: 0, impresiones: 0, alcance: 0 }
  );

  return (
    <Card className="overflow-hidden border-2 border-primary/10 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/5 px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-wide text-card-foreground uppercase">
          <Megaphone className="size-4 text-primary" />
          Pauta Meta
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="h-7 gap-1 border-primary/20 bg-transparent px-2 text-[10px] font-bold text-card-foreground uppercase hover:bg-primary/10 hover:text-card-foreground"
          >
            {expanded ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
            {expanded ? "Colapsar" : "Expandir"}
          </Button>
          <Button
            size="sm"
            onClick={addPautaMeta}
            className="h-7 gap-1 bg-accent px-3 text-[10px] font-bold text-accent-foreground uppercase hover:bg-accent/90"
          >
            <Plus className="size-3" />
            {"Campa\u00f1a"}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-0">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-4 border-b border-border bg-primary/[0.03] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                Total invertido:
              </span>
              <span className="font-mono text-sm font-bold text-primary">
                ${formatNumber(totals.importeGastado)}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                Impresiones:
              </span>
              <span className="font-mono text-sm font-bold text-card-foreground">
                {formatNumber(totals.impresiones)}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                Alcance:
              </span>
              <span className="font-mono text-sm font-bold text-card-foreground">
                {formatNumber(totals.alcance)}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                {"Campa\u00f1as:"}
              </span>
              <span className="flex size-5 items-center justify-center rounded-sm bg-accent text-[10px] font-bold text-accent-foreground">
                {data.pautaMeta.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="min-w-[200px] text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    {"Campa\u00f1a"}
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Resultados
                  </TableHead>
                  <TableHead className="min-w-[180px] text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Tipo
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Costo/Resultado
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Importe Gastado
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Impresiones
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    Alcance
                  </TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.pautaMeta.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border transition-colors hover:bg-primary/[0.03]"
                  >
                    <TableCell>
                      <CampaignNameCell
                        value={row.campana}
                        onChange={(v) => updatePautaMeta(row.id, "campana", v)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericCell
                        value={row.resultados}
                        onChange={(v) => updatePautaMeta(row.id, "resultados", v)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={row.tipoResultado}
                        onValueChange={(v) =>
                          updatePautaMeta(row.id, "tipoResultado", v)
                        }
                      >
                        <SelectTrigger className="h-7 w-[170px] border-accent/20 bg-transparent text-[10px] text-card-foreground focus:ring-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-popover">
                          {TIPO_RESULTADO_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt}
                              value={opt}
                              className="text-xs text-popover-foreground"
                            >
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericCell
                        value={row.costoPorResultado}
                        onChange={(v) =>
                          updatePautaMeta(row.id, "costoPorResultado", v)
                        }
                        prefix="$"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericCell
                        value={row.importeGastado}
                        onChange={(v) =>
                          updatePautaMeta(row.id, "importeGastado", v)
                        }
                        prefix="$"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericCell
                        value={row.impresiones}
                        onChange={(v) =>
                          updatePautaMeta(row.id, "impresiones", v)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericCell
                        value={row.alcance}
                        onChange={(v) => updatePautaMeta(row.id, "alcance", v)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePautaMeta(row.id)}
                        className="size-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {data.pautaMeta.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      {"No hay campa\u00f1as de pauta. Haz clic en \"+ Campa\u00f1a\" para agregar."}
                    </TableCell>
                  </TableRow>
                )}

                {/* Totals row */}
                {data.pautaMeta.length > 0 && (
                  <TableRow className="border-t-2 border-primary/20 bg-primary/[0.04] font-bold hover:bg-primary/[0.04]">
                    <TableCell className="text-xs font-bold tracking-wide text-card-foreground uppercase">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-card-foreground">
                      {formatNumber(totals.resultados)}
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell className="text-right font-mono text-xs font-bold text-primary">
                      ${formatNumber(totals.importeGastado)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-card-foreground">
                      {formatNumber(totals.impresiones)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold text-card-foreground">
                      {formatNumber(totals.alcance)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
