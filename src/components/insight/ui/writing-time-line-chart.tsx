"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { hour: "00", entries: 186 },
  { hour: "02", entries: 305 },
  { hour: "04", entries: 237 },
  { hour: "06", entries: 73 },
  { hour: "08", entries: 209 },
  { hour: "10", entries: 214 },
  { hour: "12", entries: 100 },
  { hour: "14", entries: 60 },
  { hour: "16", entries: 50 },
  { hour: "18", entries: 40 },
  { hour: "20", entries: 330 },
];

const chartConfig = {
  entries: {
    label: "Entries",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function WordTimetLineChart() {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="entries"
          type="natural"
          stroke="var(--color-entries)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
