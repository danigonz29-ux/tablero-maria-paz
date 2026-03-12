"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2 } from "lucide-react";

export function ConclusionesTable() {
  const { data, addConclusion, updateConclusion, removeConclusion, isEditMode } = useDashboard();
  const [newConclusion, setNewConclusion] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newConclusion.trim()) return;
    addConclusion(newConclusion.trim());
    setNewConclusion("");
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-primary uppercase">
            <div className="flex size-6 items-center justify-center bg-primary">
              <FileText className="size-3.5 text-primary-foreground" />
            </div>
            Conclusiones Generales
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add form - only in edit mode */}
        {isEditMode && (
          <div className="flex gap-2">
            <Input
              placeholder="Agregar nueva conclusion..."
              value={newConclusion}
              onChange={(e) => setNewConclusion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
              className="flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={!newConclusion.trim()}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>
        )}

        {/* List of conclusions */}
        {data.conclusiones.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No hay conclusiones registradas.
          </div>
        ) : (
          <div className="space-y-3">
            {data.conclusiones.map((conclusion, index) => (
              <div
                key={conclusion.id}
                className="group flex items-start gap-3 rounded-lg border bg-secondary/30 p-4"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {editingId === conclusion.id && isEditMode ? (
                    <Textarea
                      autoFocus
                      defaultValue={conclusion.texto}
                      className="min-h-[60px] text-sm"
                      onBlur={(e) => {
                        updateConclusion(conclusion.id, e.target.value);
                        setEditingId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          updateConclusion(conclusion.id, e.currentTarget.value);
                          setEditingId(null);
                        }
                        if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                    />
                  ) : isEditMode ? (
                    <button
                      onClick={() => setEditingId(conclusion.id)}
                      className="text-left text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {conclusion.texto || "Escribir conclusion..."}
                    </button>
                  ) : (
                    <p className="text-sm text-foreground">
                      {conclusion.texto || "-"}
                    </p>
                  )}
                </div>
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConclusion(conclusion.id)}
                    className="size-8 shrink-0 p-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Eliminar conclusion</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
