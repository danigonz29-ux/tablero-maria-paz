"use client";

import { useDashboard } from "@/lib/dashboard-context";
import { formatNumber } from "@/lib/number-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Campaign palette: red, yellow, pink/lavender, maroon, orange */
const COLORS = [
  "#DC2626",
  "#FACC15",
  "#C084FC",
  "#7C2D12",
  "#F97316",
  "#E879F9",
  "#EF4444",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { medio: string; cantidad: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="text-sm font-semibold text-card-foreground">
        {item.payload.medio}
      </p>
      <p className="text-xs text-muted-foreground">
        {formatNumber(item.value)}
      </p>
    </div>
  );
}

export function MediosPieChart() {
  const { data } = useDashboard();

  const chartData = data.medios.filter((m) => m.cantidad > 0);
  const total = chartData.reduce((s, m) => s + m.cantidad, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
          <PieChartIcon className="size-4 text-accent" />
          {"Medios de Difusi\u00f3n"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            Sin datos de medios para mostrar.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 lg:flex-row">
            <div className="h-[260px] w-full max-w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="cantidad"
                    nameKey="medio"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={105}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend list */}
            <div className="flex flex-col gap-2 text-xs">
              {chartData.map((m, i) => {
                const pct =
                  total > 0 ? ((m.cantidad / total) * 100).toFixed(1) : "0";
                return (
                  <div key={m.medio} className="flex items-center gap-3">
                    <span
                      className="size-3 shrink-0 rounded-sm"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">
                      {m.medio}
                    </span>
                    <span className="ml-auto tabular-nums text-muted-foreground">
                      {formatNumber(m.cantidad)}{" "}
                      <span className="text-muted-foreground/60">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                );
              })}

              {/* Total row */}
              <div className="mt-1 flex items-center gap-3 border-t pt-2">
                <span className="size-3 shrink-0" />
                <span className="font-semibold text-foreground">Total</span>
                <span className="ml-auto font-semibold tabular-nums text-foreground">
                  {formatNumber(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
