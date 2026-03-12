"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Lock, Unlock, Copy, Check, Zap, Plus, Trash2, Link2 } from "lucide-react";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEDIOS_OPTIONS, type MedioOption, type LinkRow } from "@/lib/types";

export function EditModePanel() {
  const { isEditMode, setIsEditMode, data, updateKPI, updateContactoDirecto, addLink, removeLink } = useDashboard();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Draft values for KPIs
  const [draftKpis, setDraftKpis] = useState({
    cantidad: formatNumber(data.kpis.cantidad),
    meGusta: formatNumber(data.kpis.meGusta),
    compartido: formatNumber(data.kpis.compartido),
    comentario: formatNumber(data.kpis.comentario),
    seguidoresCaptados: formatNumber(data.kpis.seguidoresCaptados),
    totalInvertido: formatNumber(data.kpis.totalInvertido),
    ondaFactor: String(data.kpis.ondaFactor),
    ondaExpansiva: formatNumber(data.kpis.ondaExpansiva),
    ondaAuto: data.kpis.ondaAuto,
  });

  // Draft values for Contacto Directo
  const [draftContacto, setDraftContacto] = useState({
    diasCampana: String(data.contactoDirecto.diasCampana),
    smsEnviosDiarios: formatNumber(data.contactoDirecto.sms.enviosDiarios),
    smsCostoUnitario: String(data.contactoDirecto.sms.costoUnitario),
    llamadasDiarias: formatNumber(data.contactoDirecto.llamadas.llamadasDiarias),
    llamadasCostoUnitario: String(data.contactoDirecto.llamadas.costoUnitario),
  });

  // Draft for new link entry
  const [newLink, setNewLink] = useState({
    publicacion: "",
    url: "",
    medio: "Facebook" as MedioOption,
    cantidad: "",
    engagementRate: "",
  });

  const handleAddLink = () => {
    if (!newLink.publicacion.trim() && !newLink.url.trim()) return;
    
    // Add the link with all data at once
    addLink({
      publicacion: newLink.publicacion,
      url: newLink.url,
      medio: newLink.medio,
      cantidad: parseLocalNumber(newLink.cantidad),
      engagementRate: parseFloat(newLink.engagementRate) || 0,
    });
    
    // Reset form
    setNewLink({
      publicacion: "",
      url: "",
      medio: "Facebook",
      cantidad: "",
      engagementRate: "",
    });
  };

  const handleCopyViewLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEditLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("edit", "true");
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveKpis = () => {
    updateKPI("cantidad", parseLocalNumber(draftKpis.cantidad));
    updateKPI("meGusta", parseLocalNumber(draftKpis.meGusta));
    updateKPI("compartido", parseLocalNumber(draftKpis.compartido));
    updateKPI("comentario", parseLocalNumber(draftKpis.comentario));
    updateKPI("seguidoresCaptados", parseLocalNumber(draftKpis.seguidoresCaptados));
    updateKPI("totalInvertido", parseLocalNumber(draftKpis.totalInvertido));
    updateKPI("ondaFactor", parseFloat(draftKpis.ondaFactor) || 3.5);
    updateKPI("ondaAuto", draftKpis.ondaAuto);
    if (!draftKpis.ondaAuto) {
      updateKPI("ondaExpansiva", parseLocalNumber(draftKpis.ondaExpansiva));
    }
  };

  const handleSaveContacto = () => {
    updateContactoDirecto({
      diasCampana: parseInt(draftContacto.diasCampana) || 10,
      sms: {
        enviosDiarios: parseLocalNumber(draftContacto.smsEnviosDiarios),
        frecuencia: data.contactoDirecto.sms.frecuencia,
        costoUnitario: parseFloat(draftContacto.smsCostoUnitario) || 0,
      },
      llamadas: {
        llamadasDiarias: parseLocalNumber(draftContacto.llamadasDiarias),
        frecuencia: data.contactoDirecto.llamadas.frecuencia,
        costoUnitario: parseFloat(draftContacto.llamadasCostoUnitario) || 0,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
        >
          <Settings className="size-4" />
          <span className="hidden sm:inline">Editar Datos</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Settings className="size-5 text-primary" />
            Panel de Edicion de Datos
          </DialogTitle>
          <DialogDescription>
            Configura el modo de edicion y modifica los datos del dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Edit Mode Toggle */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  {isEditMode ? (
                    <Unlock className="size-4 text-green-600" />
                  ) : (
                    <Lock className="size-4 text-muted-foreground" />
                  )}
                  Modo de Edicion
                </span>
                <Switch
                  checked={isEditMode}
                  onCheckedChange={setIsEditMode}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "El modo edicion esta activo. Puedes modificar todos los datos del dashboard."
                  : "El modo solo lectura esta activo. Los datos no se pueden modificar."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyViewLink}
                  className="gap-1.5 text-xs"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  Copiar link solo lectura
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEditLink}
                  className="gap-1.5 text-xs"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                  Copiar link con edicion
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Tabs - only show if edit mode is on */}
          {isEditMode && (
            <Tabs defaultValue="kpis" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="kpis">KPIs</TabsTrigger>
                <TabsTrigger value="contenidos">Contenidos</TabsTrigger>
                <TabsTrigger value="contacto">Contacto</TabsTrigger>
              </TabsList>

              <TabsContent value="kpis" className="space-y-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad" className="text-xs text-muted-foreground">
                      Contenidos Apoyados
                    </Label>
                    <Input
                      id="cantidad"
                      value={draftKpis.cantidad}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, cantidad: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meGusta" className="text-xs text-muted-foreground">
                      Interacciones Captadas
                    </Label>
                    <Input
                      id="meGusta"
                      value={draftKpis.meGusta}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, meGusta: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compartido" className="text-xs text-muted-foreground">
                      Compartidos
                    </Label>
                    <Input
                      id="compartido"
                      value={draftKpis.compartido}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, compartido: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comentario" className="text-xs text-muted-foreground">
                      Comentarios
                    </Label>
                    <Input
                      id="comentario"
                      value={draftKpis.comentario}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, comentario: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seguidores" className="text-xs text-muted-foreground">
                      Seguidores Captados
                    </Label>
                    <Input
                      id="seguidores"
                      value={draftKpis.seguidoresCaptados}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, seguidoresCaptados: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalInvertido" className="text-xs text-muted-foreground">
                      Total Invertido (COP)
                    </Label>
                    <Input
                      id="totalInvertido"
                      value={draftKpis.totalInvertido}
                      onChange={(e) =>
                        setDraftKpis({ ...draftKpis, totalInvertido: e.target.value })
                      }
                      className="font-mono"
                    />
                  </div>
                </div>

                {/* Onda Expansiva Controls */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Zap className="size-4 text-accent" />
                      Onda Expansiva
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="onda-auto-panel" className="text-sm font-medium">
                        Auto calcular
                      </Label>
                      <Switch
                        id="onda-auto-panel"
                        checked={draftKpis.ondaAuto}
                        onCheckedChange={(v) =>
                          setDraftKpis({ ...draftKpis, ondaAuto: v })
                        }
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ondaFactor" className="text-xs text-muted-foreground">
                          Factor
                        </Label>
                        <Input
                          id="ondaFactor"
                          type="number"
                          value={draftKpis.ondaFactor}
                          onChange={(e) =>
                            setDraftKpis({ ...draftKpis, ondaFactor: e.target.value })
                          }
                          disabled={!draftKpis.ondaAuto}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ondaExpansiva" className="text-xs text-muted-foreground">
                          Valor Manual
                        </Label>
                        <Input
                          id="ondaExpansiva"
                          value={draftKpis.ondaExpansiva}
                          onChange={(e) =>
                            setDraftKpis({ ...draftKpis, ondaExpansiva: e.target.value })
                          }
                          disabled={draftKpis.ondaAuto}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {draftKpis.ondaAuto
                        ? "El valor se calcula automaticamente: Contenidos Apoyados x Factor"
                        : "Ingresa el valor manualmente"}
                    </p>
                  </CardContent>
                </Card>

                <Button onClick={handleSaveKpis} className="w-full bg-primary text-primary-foreground">
                  Guardar KPIs
                </Button>
              </TabsContent>

              <TabsContent value="contenidos" className="space-y-4 pt-4">
                {/* Add new link form */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Plus className="size-4 text-primary" />
                      Agregar Contenido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Publicacion</Label>
                        <Input
                          placeholder="Titulo de la publicacion..."
                          value={newLink.publicacion}
                          onChange={(e) => setNewLink({ ...newLink, publicacion: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">URL</Label>
                        <Input
                          placeholder="https://..."
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Medio</Label>
                        <Select
                          value={newLink.medio}
                          onValueChange={(v) => setNewLink({ ...newLink, medio: v as MedioOption })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MEDIOS_OPTIONS.map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Alcance Total</Label>
                        <Input
                          placeholder="0"
                          value={newLink.cantidad}
                          onChange={(e) => setNewLink({ ...newLink, cantidad: e.target.value })}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Engagement Rate (%)</Label>
                        <Input
                          placeholder="0.0"
                          value={newLink.engagementRate}
                          onChange={(e) => setNewLink({ ...newLink, engagementRate: e.target.value })}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleAddLink} 
                      className="w-full gap-2 bg-primary text-primary-foreground"
                      disabled={!newLink.publicacion.trim() && !newLink.url.trim()}
                    >
                      <Plus className="size-4" />
                      Agregar a la Tabla
                    </Button>
                  </CardContent>
                </Card>

                {/* Existing links list */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Link2 className="size-4 text-muted-foreground" />
                      Contenidos Actuales ({data.links.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.links.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No hay contenidos. Agrega uno arriba.
                      </p>
                    ) : (
                      <div className="max-h-60 space-y-2 overflow-y-auto">
                        {data.links.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between gap-2 rounded-lg border bg-secondary/30 p-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {link.publicacion || "Sin titulo"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {link.medio} - {formatNumber(link.cantidad)} alcance - {link.engagementRate}%
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLink(link.id)}
                              className="size-8 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacto" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="diasCampana" className="text-xs text-muted-foreground">
                    {"Dias de Campa\u00f1a"}
                  </Label>
                  <Input
                    id="diasCampana"
                    type="number"
                    value={draftContacto.diasCampana}
                    onChange={(e) =>
                      setDraftContacto({ ...draftContacto, diasCampana: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">SMS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Envios Diarios</Label>
                        <Input
                          value={draftContacto.smsEnviosDiarios}
                          onChange={(e) =>
                            setDraftContacto({ ...draftContacto, smsEnviosDiarios: e.target.value })
                          }
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Costo Unitario</Label>
                        <Input
                          type="number"
                          value={draftContacto.smsCostoUnitario}
                          onChange={(e) =>
                            setDraftContacto({ ...draftContacto, smsCostoUnitario: e.target.value })
                          }
                          className="font-mono"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Llamadas Voz</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Llamadas Diarias</Label>
                        <Input
                          value={draftContacto.llamadasDiarias}
                          onChange={(e) =>
                            setDraftContacto({ ...draftContacto, llamadasDiarias: e.target.value })
                          }
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Costo Unitario</Label>
                        <Input
                          type="number"
                          value={draftContacto.llamadasCostoUnitario}
                          onChange={(e) =>
                            setDraftContacto({ ...draftContacto, llamadasCostoUnitario: e.target.value })
                          }
                          className="font-mono"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Button onClick={handleSaveContacto} className="w-full bg-primary text-primary-foreground">
                  Guardar Contacto Directo
                </Button>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
