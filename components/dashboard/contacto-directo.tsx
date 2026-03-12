"use client";

import { useState } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber, parseLocalNumber } from "@/lib/number-utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Phone, LayoutGrid } from "lucide-react";
import type { FrecuenciaOption } from "@/lib/types";

const FRECUENCIAS: FrecuenciaOption[] = ["Diario", "Interdiario", "Semanal", "Mensual"];

function getFrecuenciaMultiplier(freq: FrecuenciaOption): number {
  switch (freq) {
    case "Diario": return 1;
    case "Interdiario": return 0.5;
    case "Semanal": return 1 / 7;
    case "Mensual": return 1 / 30;
    default: return 1;
  }
}

export function ContactoDirecto() {
  const { data, updateContactoDirecto, isEditMode } = useDashboard();
  const { contactoDirecto } = data;
  const [editingField, setEditingField] = useState<string | null>(null);

  // Calculate totals
  const smsMultiplier = getFrecuenciaMultiplier(contactoDirecto.sms.frecuencia);
  const totalSmsEnviados = Math.round(contactoDirecto.sms.enviosDiarios * contactoDirecto.diasCampana * smsMultiplier);
  const costoTotalSms = totalSmsEnviados * contactoDirecto.sms.costoUnitario;

  const llamadasMultiplier = getFrecuenciaMultiplier(contactoDirecto.llamadas.frecuencia);
  const totalLlamadas = Math.round(contactoDirecto.llamadas.llamadasDiarias * contactoDirecto.diasCampana * llamadasMultiplier);
  const costoTotalLlamadas = totalLlamadas * contactoDirecto.llamadas.costoUnitario;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-primary" />
          <h2 className="text-xs font-bold tracking-[0.15em] text-foreground uppercase">
            Contacto Directo
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{"D\u00edas de campa\u00f1a:"}</span>
          {editingField === "dias" && isEditMode ? (
            <Input
              autoFocus
              className="h-8 w-16 text-center text-sm"
              defaultValue={contactoDirecto.diasCampana}
              onBlur={(e) => {
                updateContactoDirecto({ diasCampana: parseInt(e.target.value) || 10 });
                setEditingField(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateContactoDirecto({ diasCampana: parseInt(e.currentTarget.value) || 10 });
                  setEditingField(null);
                }
              }}
            />
          ) : isEditMode ? (
            <button
              onClick={() => setEditingField("dias")}
              className="h-8 w-16 rounded-md border bg-background px-2 text-center text-sm font-medium hover:border-primary"
            >
              {contactoDirecto.diasCampana}
            </button>
          ) : (
            <span className="h-8 w-16 flex items-center justify-center rounded-md border bg-background px-2 text-sm font-medium">
              {contactoDirecto.diasCampana}
            </span>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* SMS Card */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <MessageSquare className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">SMS</h3>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground uppercase">Envios Diarios</p>
                {editingField === "sms-envios" && isEditMode ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm font-semibold"
                    defaultValue={formatNumber(contactoDirecto.sms.enviosDiarios)}
                    onBlur={(e) => {
                      updateContactoDirecto({
                        sms: { ...contactoDirecto.sms, enviosDiarios: parseLocalNumber(e.target.value) }
                      });
                      setEditingField(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateContactoDirecto({
                          sms: { ...contactoDirecto.sms, enviosDiarios: parseLocalNumber(e.currentTarget.value) }
                        });
                        setEditingField(null);
                      }
                    }}
                  />
                ) : isEditMode ? (
                  <button
                    onClick={() => setEditingField("sms-envios")}
                    className="text-left font-serif text-xl font-bold tabular-nums text-foreground hover:text-primary"
                  >
                    {formatNumber(contactoDirecto.sms.enviosDiarios)}
                  </button>
                ) : (
                  <span className="font-serif text-xl font-bold tabular-nums text-foreground">
                    {formatNumber(contactoDirecto.sms.enviosDiarios)}
                  </span>
                )}
              </div>
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground uppercase">Frecuencia</p>
                {isEditMode ? (
                  <Select
                    value={contactoDirecto.sms.frecuencia}
                    onValueChange={(v) => updateContactoDirecto({
                      sms: { ...contactoDirecto.sms, frecuencia: v as FrecuenciaOption }
                    })}
                  >
                    <SelectTrigger className="h-8 text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRECUENCIAS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm font-semibold">{contactoDirecto.sms.frecuencia}</span>
                )}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Total Enviados x {contactoDirecto.diasCampana} dias
              </span>
              <span className="font-serif text-lg font-bold tabular-nums">
                {formatNumber(totalSmsEnviados)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Costo Total</span>
              <span className="font-serif text-lg font-bold tabular-nums text-foreground">
                {formatNumber(costoTotalSms)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Llamadas Voz Card */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <Phone className="size-4 text-primary" />
              </div>
              <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">Llamadas Voz</h3>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground uppercase">Llamadas Realizadas</p>
                {editingField === "llamadas-diarias" && isEditMode ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm font-semibold"
                    defaultValue={formatNumber(contactoDirecto.llamadas.llamadasDiarias)}
                    onBlur={(e) => {
                      updateContactoDirecto({
                        llamadas: { ...contactoDirecto.llamadas, llamadasDiarias: parseLocalNumber(e.target.value) }
                      });
                      setEditingField(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateContactoDirecto({
                          llamadas: { ...contactoDirecto.llamadas, llamadasDiarias: parseLocalNumber(e.currentTarget.value) }
                        });
                        setEditingField(null);
                      }
                    }}
                  />
                ) : isEditMode ? (
                  <button
                    onClick={() => setEditingField("llamadas-diarias")}
                    className="text-left font-serif text-xl font-bold tabular-nums text-foreground hover:text-primary"
                  >
                    {formatNumber(contactoDirecto.llamadas.llamadasDiarias)}
                  </button>
                ) : (
                  <span className="font-serif text-xl font-bold tabular-nums text-foreground">
                    {formatNumber(contactoDirecto.llamadas.llamadasDiarias)}
                  </span>
                )}
              </div>
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground uppercase">Frecuencia</p>
                {isEditMode ? (
                  <Select
                    value={contactoDirecto.llamadas.frecuencia}
                    onValueChange={(v) => updateContactoDirecto({
                      llamadas: { ...contactoDirecto.llamadas, frecuencia: v as FrecuenciaOption }
                    })}
                  >
                    <SelectTrigger className="h-8 text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRECUENCIAS.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="text-sm font-semibold">{contactoDirecto.llamadas.frecuencia}</span>
                )}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Total Llamadas x {contactoDirecto.diasCampana} dias
              </span>
              <span className="font-serif text-lg font-bold tabular-nums">
                {formatNumber(totalLlamadas)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Costo Total</span>
              <span className="font-serif text-lg font-bold tabular-nums text-foreground">
                {formatNumber(costoTotalLlamadas)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
