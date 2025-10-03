
"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { game: "ATS", jobs: 7870, fill: "var(--color-ats)" },
  { game: "ETS2", jobs: 2130, fill: "var(--color-ets2)" },
]

const chartConfig = {
  jobs: {
    label: "Jobs",
  },
  ats: {
    label: "ATS",
    color: "hsl(var(--chart-2))",
  },
  ets2: {
    label: "ETS2",
    color: "hsl(var(--primary))",
  },
}

export function DriverHubPieChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="jobs"
          nameKey="game"
          innerRadius={60}
          strokeWidth={5}
        >
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
