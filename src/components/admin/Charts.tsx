"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIsDark } from "@/lib/hooks";
import { formatEur } from "@/lib/utils";

/**
 * Chart colors follow the dataviz method: single-hue sequential encoding
 * (both charts show magnitude, not identity), validated per surface:
 * light #2456e0 on #ffffff, dark #3d74f0 on #0d1421 — all checks pass.
 */

function chartTheme(dark: boolean) {
  return {
    series: dark ? "#3d74f0" : "#2456e0",
    grid: dark ? "rgba(148,170,205,0.14)" : "#e9eef5",
    axis: dark ? "#8d9ab2" : "#68758d",
    label: dark ? "#f1f5fb" : "#0b1424",
  };
}

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  valueFormatter: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-3.5 py-2.5 card-shadow-lg">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="font-display text-[15px] font-bold text-ink [font-variant-numeric:tabular-nums]">
        {valueFormatter(payload[0].value)}
      </p>
    </div>
  );
}

export function RevenueTrendChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  const dark = useIsDark();
  const t = chartTheme(dark);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.series} stopOpacity={0.22} />
            <stop offset="100%" stopColor={t.series} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={t.grid} strokeDasharray="0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: t.axis, fontSize: 11 }}
          axisLine={{ stroke: t.grid }}
          tickLine={false}
          dy={6}
        />
        <YAxis
          tick={{ fill: t.axis, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={52}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}k€`}
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={formatEur} />}
          cursor={{ stroke: t.axis, strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={t.series}
          strokeWidth={2}
          fill="url(#revenue-fill)"
          dot={false}
          activeDot={{ r: 4.5, strokeWidth: 2, stroke: dark ? "#0d1421" : "#ffffff" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryRevenueChart({
  data,
}: {
  data: { category: string; revenue: number }[];
}) {
  const dark = useIsDark();
  const t = chartTheme(dark);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 64, left: 8, bottom: 0 }}
        barCategoryGap="28%"
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fill: t.axis, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={104}
        />
        <Tooltip
          content={<ChartTooltip valueFormatter={formatEur} />}
          cursor={{ fill: dark ? "rgba(148,170,205,0.06)" : "rgba(11,20,36,0.03)" }}
        />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={t.series} />
          ))}
          <LabelList
            dataKey="revenue"
            position="right"
            formatter={(v: unknown) => formatEur(Number(v ?? 0))}
            style={{
              fill: t.label,
              fontSize: 11,
              fontWeight: 600,
              fontVariantNumeric: "tabular-nums",
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
