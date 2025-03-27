"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "Jan", words: 186 },
  { month: "Feb", words: 305 },
  { month: "March", words: 237 },
  { month: "April", words: 73 },
  { month: "May", words: 209 },
  { month: "June", words: 214 },
  { month: "Jul", words: 100 },
  { month: "Aug", words: 60 },
  { month: "Sep", words: 50 },
  { month: "Nov", words: 40 },
  { month: "Dec", words: 330 },
];

const chartConfig = {
  words: {
    label: "Words",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function WordCountLineChart() {
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
          dataKey="month"
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
          dataKey="words"
          type="natural"
          stroke="var(--color-words)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
