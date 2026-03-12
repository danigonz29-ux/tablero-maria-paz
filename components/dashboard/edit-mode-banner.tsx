"use client";

import { useDashboard } from "@/lib/dashboard-context";
import { Lock, Unlock } from "lucide-react";

export function EditModeBanner() {
  const { isEditMode } = useDashboard();

  if (isEditMode) {
    return (
      <div className="bg-green-600 px-4 py-1.5 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-white">
          <Unlock className="size-3.5" />
          {"Modo edici\u00f3n activo \u2014 Los datos son modificables"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted px-4 py-1.5 text-center">
      <p className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
        <Lock className="size-3.5" />
        {"Modo solo lectura \u2014 Agrega ?edit=true a la URL para editar"}
      </p>
    </div>
  );
}
