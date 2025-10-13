
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartData = [
  { type: 'Cargo Market', value: 120, fill: 'var(--color-cargo)' },
  { type: 'Freight Market', value: 90, fill: 'var(--color-freight)' },
  { type: 'External Contracts', value: 60, fill: 'var(--color-external)' },
  { type: 'Special Transport', value: 30, fill: 'var(--color-special)' },
];

const chartConfig = {
  value: {
    label: 'Jobs',
  },
  cargo: {
    label: 'Cargo Market',
    color: 'hsl(var(--chart-1))',
  },
  freight: {
    label: 'Freight Market',
    color: 'hsl(var(--chart-2))',
  },
  external: {
    label: 'External Contracts',
    color: 'hsl(var(--chart-3))',
  },
  special: {
    label: 'Special Transport',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;


export function TotalJobsChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full w-full"
    >
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Tooltip
            content={<ChartTooltipContent nameKey="type" hideLabel />}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={80}
            paddingAngle={5}
          >
              {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
