
"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"

const chartData = [
  { month: "August", jobs: 186 },
  { month: "September", jobs: 305 },
  { month: "October", jobs: 237 },
]

const chartConfig = {
  jobs: {
    label: "Jobs",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function DriverHubLineChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <AreaChart
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
            <linearGradient id="fillJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-jobs)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-jobs)" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="jobs"
          type="natural"
          fill="url(#fillJobs)"
          stroke="var(--color-jobs)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
