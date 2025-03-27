"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { category: "travel", entries: 275, fill: "var(--color-travel)" },
  { category: "personal", entries: 200, fill: "var(--color-personal)" },
  { category: "work", entries: 187, fill: "var(--color-work)" },
];

const chartConfig = {
  entries: {
    label: "Entries",
  },
  travel: {
    label: "travel",
    color: "var(--chart-1)",
  },
  personal: {
    label: "personal",
    color: "var(--chart-2)",
  },
  work: {
    label: "work",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export default function CategoryPieChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent nameKey="entries" hideLabel />}
        />
        <Pie data={chartData} dataKey="entries">
          <LabelList
            dataKey="category"
            className="fill-background"
            stroke="none"
            fontSize={12}
            formatter={(value: keyof typeof chartConfig) =>
              chartConfig[value]?.label
            }
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
