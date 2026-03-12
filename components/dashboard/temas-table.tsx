"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Hash } from "lucide-react";

export function TemasTable() {
  const { data, addTema, updateTema, removeTema, isEditMode } = useDashboard();
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [newTema, setNewTema] = useState("");
  const [newCantidad, setNewCantidad] = useState("0");

  const handleAddTema = () => {
    if (!newTema.trim()) return;
    addTema(newTema.trim(), parseLocalNumber(newCantidad));
    setNewTema("");
    setNewCantidad("0");
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-primary" />
            <h2 className="text-xs font-bold tracking-[0.15em] text-foreground uppercase">
              Temas
            </h2>
          </div>
        </div>

        {/* Add form - only show in edit mode */}
        {isEditMode && (
          <div className="border-b bg-secondary/30 px-5 py-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="mb-1.5 block text-[10px] text-muted-foreground uppercase">
                  Tema
                </Label>
                <Input
                  placeholder="Nombre del tema..."
                  value={newTema}
                  onChange={(e) => setNewTema(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTema();
                  }}
                />
              </div>
              <div className="w-28">
                <Label className="mb-1.5 block text-[10px] text-muted-foreground uppercase">
                  Cantidad
                </Label>
                <Input
                  value={newCantidad}
                  onChange={(e) => setNewCantidad(e.target.value)}
                  className="h-9 text-right"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTema();
                  }}
                />
              </div>
              <Button
                onClick={handleAddTema}
                className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="size-3.5" />
                Agregar
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/20">
                <th className="px-5 py-3 text-left text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Tema
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Cantidad
                </th>
                <th className="w-12 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.temas.map((tema) => (
                <tr
                  key={tema.id}
                  className="border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/20"
                >
                  {/* TEMA */}
                  <td className="px-5 py-3">
                    {editingCell === `tema-${tema.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="h-8 text-sm"
                        defaultValue={tema.tema}
                        onBlur={(e) => {
                          updateTema(tema.id, "tema", e.target.value);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateTema(tema.id, "tema", e.currentTarget.value);
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : isEditMode ? (
                      <button
                        className="text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
                        onClick={() => setEditingCell(`tema-${tema.id}`)}
                      >
                        {tema.tema || "Agregar tema..."}
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-foreground">
                        {tema.tema || "-"}
                      </span>
                    )}
                  </td>

                  {/* CANTIDAD */}
                  <td className="px-5 py-3 text-right">
                    {editingCell === `tcant-${tema.id}` && isEditMode ? (
                      <Input
                        autoFocus
                        className="ml-auto h-8 w-32 text-right text-sm"
                        defaultValue={formatNumber(tema.cantidad)}
                        onBlur={(e) => {
                          updateTema(tema.id, "cantidad", parseLocalNumber(e.target.value));
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateTema(tema.id, "cantidad", parseLocalNumber(e.currentTarget.value));
                            setEditingCell(null);
                          }
                        }}
                      />
                    ) : isEditMode ? (
                      <button
                        className="inline-block rounded-md px-2 py-0.5 font-serif text-sm font-semibold tabular-nums transition-colors hover:bg-secondary"
                        onClick={() => setEditingCell(`tcant-${tema.id}`)}
                      >
                        {formatNumber(tema.cantidad)}
                      </button>
                    ) : (
                      <span className="font-serif text-sm font-semibold tabular-nums">
                        {formatNumber(tema.cantidad)}
                      </span>
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-2 py-3">
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTema(tema.id)}
                        className="size-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Eliminar tema</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {data.temas.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No hay temas. Usa el formulario de arriba para agregar uno.
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
