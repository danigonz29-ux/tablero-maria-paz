"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { MEDIOS_OPTIONS } from "@/lib/types";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Trash2, Link2, ExternalLink } from "lucide-react";

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function parsePercent(value: string): number {
  // Remove % sign and parse
  const cleaned = value.replace(/%/g, "").replace(/,/g, ".").trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
}

export function LinksTable() {
  const { data, addLink, updateLink, removeLink, isEditMode } = useDashboard();
  const [editingCell, setEditingCell] = useState<string | null>(null);

  // Calculate average engagement rate
  const avgEngagement = data.links.length > 0
    ? data.links.reduce((s, l) => s + (l.engagementRate || 0), 0) / data.links.length
    : 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          <Link2 className="size-4 text-primary" />
          Contenidos Apoyados
        </CardTitle>
        {isEditMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={addLink}
            className="gap-1.5 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
          >
            <Plus className="size-3" />
            Agregar
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/40">
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {"PUBLICACI\u00d3N"}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  MEDIO
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  ALCANCE TOTAL
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  ENGAGEMENT RATE
                </th>
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.links.map((link) => (
                <tr
                  key={link.id}
                  className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30"
                >
                  {/* PUBLICACION */}
                  <td className="max-w-[180px] px-4 py-2.5">
                    {editingCell === `pub-${link.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="h-7 text-xs"
                        defaultValue={link.publicacion || ""}
                        onBlur={(e) => {
                          updateLink(link.id, "publicacion", e.target.value);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateLink(link.id, "publicacion", e.currentTarget.value);
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : isEditMode ? (
                      <button
                        className="max-w-[170px] truncate text-left text-xs font-medium text-foreground transition-colors hover:text-primary"
                        onClick={() => setEditingCell(`pub-${link.id}`)}
                        title={link.publicacion || "Sin titulo"}
                      >
                        {link.publicacion || (
                          <span className="text-muted-foreground/50 italic">
                            {"Agregar t\u00edtulo..."}
                          </span>
                        )}
                      </button>
                    ) : (
                      <span
                        className="max-w-[170px] truncate text-xs font-medium text-foreground"
                        title={link.publicacion || "Sin titulo"}
                      >
                        {link.publicacion || "-"}
                      </span>
                    )}
                  </td>

                  {/* URL */}
                  <td className="max-w-[180px] px-4 py-2.5">
                    {editingCell === `url-${link.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="h-7 text-xs"
                        defaultValue={link.url}
                        onBlur={(e) => {
                          updateLink(link.id, "url", e.target.value);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateLink(link.id, "url", e.currentTarget.value);
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {isEditMode ? (
                              <button
                                className="flex max-w-[170px] items-center gap-1.5 truncate text-left text-xs text-primary/70 hover:text-primary"
                                onClick={() => setEditingCell(`url-${link.id}`)}
                              >
                                <ExternalLink className="size-3 shrink-0" />
                                <span className="truncate">
                                  {link.url || "Agregar URL..."}
                                </span>
                              </button>
                            ) : (
                              <a
                                href={link.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex max-w-[170px] items-center gap-1.5 truncate text-xs text-primary/70 hover:text-primary"
                              >
                                <ExternalLink className="size-3 shrink-0" />
                                <span className="truncate">
                                  {link.url || "-"}
                                </span>
                              </a>
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="break-all text-xs">
                              {link.url || "Sin URL"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </td>

                  {/* MEDIO dropdown */}
                  <td className="px-4 py-2.5">
                    {isEditMode ? (
                      <Select
                        value={link.medio}
                        onValueChange={(v) => updateLink(link.id, "medio", v)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDIOS_OPTIONS.map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-foreground">{link.medio}</span>
                    )}
                  </td>

                  {/* ALCANCE TOTAL */}
                  <td className="px-4 py-2.5 text-right">
                    {editingCell === `cant-${link.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="ml-auto h-7 w-24 text-right text-xs"
                        defaultValue={formatNumber(link.cantidad)}
                        onBlur={(e) => {
                          updateLink(link.id, "cantidad", parseLocalNumber(e.target.value));
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateLink(link.id, "cantidad", parseLocalNumber(e.currentTarget.value));
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : isEditMode ? (
                      <button
                        className="inline-block rounded-md px-2 py-0.5 font-sans text-sm font-semibold tabular-nums transition-colors hover:bg-secondary"
                        onClick={() => setEditingCell(`cant-${link.id}`)}
                      >
                        {formatNumber(link.cantidad)}
                      </button>
                    ) : (
                      <span className="font-sans text-sm font-semibold tabular-nums">
                        {formatNumber(link.cantidad)}
                      </span>
                    )}
                  </td>

                  {/* ENGAGEMENT RATE */}
                  <td className="px-4 py-2.5 text-right">
                    {editingCell === `eng-${link.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="ml-auto h-7 w-20 text-right text-xs"
                        defaultValue={formatPercent(link.engagementRate || 0)}
                        onBlur={(e) => {
                          updateLink(link.id, "engagementRate", parsePercent(e.target.value));
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateLink(link.id, "engagementRate", parsePercent(e.currentTarget.value));
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : isEditMode ? (
                      <button
                        className="inline-block rounded-md px-2 py-0.5 font-sans text-sm font-semibold tabular-nums text-accent-foreground transition-colors hover:bg-secondary"
                        onClick={() => setEditingCell(`eng-${link.id}`)}
                      >
                        {formatPercent(link.engagementRate || 0)}
                      </button>
                    ) : (
                      <span className="font-sans text-sm font-semibold tabular-nums text-accent-foreground">
                        {formatPercent(link.engagementRate || 0)}
                      </span>
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-2.5">
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLink(link.id)}
                        className="size-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Eliminar link</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {data.links.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No hay contenidos. Haz clic en Agregar para empezar.
                  </td>
                </tr>
              )}
            </tbody>
            {/* Totals footer */}
            {data.links.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-primary/20 bg-secondary/30">
                  <td colSpan={3} className="px-4 py-3 text-right text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                    TOTAL / PROMEDIO
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-sm font-bold tabular-nums text-foreground">
                    {formatNumber(data.links.reduce((s, l) => s + l.cantidad, 0))}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-sm font-bold tabular-nums text-accent-foreground">
                    {formatPercent(avgEngagement)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
