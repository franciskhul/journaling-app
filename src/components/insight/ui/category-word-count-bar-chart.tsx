"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { category: "travel", words: 187, fill: "var(--color-travel)" },
  { category: "personal", words: 200, fill: "var(--color-personal)" },
  { category: "work", words: 275, fill: "var(--color-work)" },
];

const chartConfig = {
  words: {
    label: "Word Counts",
  },
  travel: {
    label: "Travel",
    color: "var(--chart-1)",
  },
  personal: {
    label: "Personal",
    color: "var(--chart-2)",
  },
  work: {
    label: "Work",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function Component() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="words"
          strokeWidth={2}
          radius={8}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={0.8}
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
