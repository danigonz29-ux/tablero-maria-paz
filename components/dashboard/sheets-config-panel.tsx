"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cloud, Loader2, Wifi, WifiOff, Settings2, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";

export function SheetsConfigPanel() {
  const {
    sheetsConfig,
    sheetsStatus,
    autoSave,
    setAutoSave,
    setMode,
    setSheetsConfig,
    connectSheets,
    syncNow,
    saveToSheets,
  } = useDashboard();

  const [showInstructions, setShowInstructions] = useState(false);

  // Check if the error indicates missing credentials
  const isMissingCredentials = sheetsStatus.error?.includes("GOOGLE_SERVICE_ACCOUNT") || 
    sheetsStatus.error?.includes("Missing") ||
    sheetsStatus.error?.includes("Token error");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Cloud className="size-4" />
          <span className="hidden sm:inline">Google Sheets</span>
          {sheetsConfig.mode === "sheets" && sheetsStatus.connected && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-xs text-primary"
            >
              Conectado
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif text-xl">
            <Settings2 className="size-5 text-primary" />
            Google Sheets
          </SheetTitle>
          <SheetDescription>
            Conecta un Google Sheet para persistir tus datos.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Mode toggle */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Modo de datos</Label>
            <Select
              value={sheetsConfig.mode}
              onValueChange={(v) => setMode(v as "local" | "sheets")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local (demo)</SelectItem>
                <SelectItem value="sheets">Google Sheets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sheetsConfig.mode === "sheets" && (
            <>
              {/* Spreadsheet ID */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="spreadsheet-id"
                  className="text-sm font-medium"
                >
                  Spreadsheet ID
                </Label>
                <Input
                  id="spreadsheet-id"
                  placeholder="1A2B3C4D5E6F..."
                  value={sheetsConfig.spreadsheetId}
                  onChange={(e) =>
                    setSheetsConfig({ spreadsheetId: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Lo encuentras en la URL del Google Sheet entre /d/ y /edit
                </p>
              </div>

              {/* Tab names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Tab KPIs</Label>
                  <Input
                    value={sheetsConfig.tabKpis}
                    onChange={(e) =>
                      setSheetsConfig({ tabKpis: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Tab Links</Label>
                  <Input
                    value={sheetsConfig.tabLinks}
                    onChange={(e) =>
                      setSheetsConfig({ tabLinks: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Tab Temas</Label>
                  <Input
                    value={sheetsConfig.tabTemas}
                    onChange={(e) =>
                      setSheetsConfig({ tabTemas: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Tab Medios</Label>
                  <Input
                    value={sheetsConfig.tabMedios}
                    onChange={(e) =>
                      setSheetsConfig({ tabMedios: e.target.value })
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-2 rounded-lg p-2 ${
                sheetsStatus.connected 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-secondary/30"
              }`}>
                {sheetsStatus.loading ? (
                  <Loader2 className="size-4 animate-spin text-primary" />
                ) : sheetsStatus.connected ? (
                  <CheckCircle2 className="size-4 text-green-600" />
                ) : (
                  <WifiOff className="size-4 text-muted-foreground" />
                )}
                <span className={`text-sm font-medium ${
                  sheetsStatus.connected ? "text-green-700" : ""
                }`}>
                  {sheetsStatus.loading
                    ? "Conectando..."
                    : sheetsStatus.connected
                      ? "Conectado correctamente"
                      : "Sin conexion"}
                </span>
              </div>
              {sheetsStatus.error && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    <div className="text-xs text-destructive">
                      <p className="font-medium">Error de conexion</p>
                      <p className="mt-1 opacity-80">{sheetsStatus.error}</p>
                    </div>
                  </div>
                  {isMissingCredentials && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2 text-xs"
                      onClick={() => setShowInstructions(!showInstructions)}
                    >
                      <Settings2 className="size-3" />
                      {showInstructions ? "Ocultar instrucciones" : "Ver instrucciones de configuracion"}
                    </Button>
                  )}
                </div>
              )}

              {/* Setup Instructions */}
              {(showInstructions || (!sheetsStatus.connected && !sheetsStatus.error)) && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="setup" className="border rounded-lg">
                    <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                      <span className="flex items-center gap-2">
                        <Settings2 className="size-4 text-primary" />
                        Configuracion inicial
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3">
                      <div className="space-y-3 text-xs text-muted-foreground">
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">1. Crear Service Account en Google Cloud:</p>
                          <ul className="ml-4 list-disc space-y-1">
                            <li>Ve a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">Google Cloud Console <ExternalLink className="size-3" /></a></li>
                            <li>Habilita la API de Google Sheets</li>
                            <li>Crea una cuenta de servicio y descarga el JSON</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">2. Configurar variables de entorno:</p>
                          <div className="rounded bg-secondary/50 p-2 font-mono text-[10px]">
                            <p>GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-cuenta@proyecto.iam.gserviceaccount.com</p>
                            <p className="mt-1">GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">3. Compartir el Google Sheet:</p>
                          <p>Comparte tu hoja de calculo con el email del service account (con permisos de Editor)</p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">4. Estructura del Sheet:</p>
                          <p>Crea estas pestanas en tu Google Sheet:</p>
                          <ul className="ml-4 list-disc space-y-1">
                            <li><strong>kpis:</strong> key, value (ej: cantidad, 35500)</li>
                            <li><strong>links:</strong> id, publicacion, url, medio, cantidad, engagementRate</li>
                            <li><strong>temas:</strong> id, tema, cantidad</li>
                            <li><strong>medios:</strong> medio, cantidad</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={connectSheets}
                  disabled={
                    !sheetsConfig.spreadsheetId || sheetsStatus.loading
                  }
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {sheetsStatus.loading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
                  Conectar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={syncNow}
                    disabled={
                      !sheetsStatus.connected || sheetsStatus.loading
                    }
                    className="flex-1"
                  >
                    Sincronizar ahora
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveToSheets}
                    disabled={
                      !sheetsStatus.connected || sheetsStatus.loading
                    }
                    className="flex-1"
                  >
                    Guardar en Sheets
                  </Button>
                </div>
              </div>

              {/* Autosave toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="autosave" className="text-sm">
                  Auto-guardar (4s debounce)
                </Label>
                <Switch
                  id="autosave"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
