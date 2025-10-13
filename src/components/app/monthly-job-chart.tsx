
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

type MonthlyJobChartProps = {
    thisMonth: number;
    lastMonth: number;
};

export function MonthlyJobChart({ thisMonth, lastMonth }: MonthlyJobChartProps) {
  const data = [
    { name: 'Last Month', jobs: lastMonth, fill: 'var(--color-lastMonth)' },
    { name: 'This Month', jobs: thisMonth, fill: 'var(--color-thisMonth)' },
  ];

  return (
     <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Bar dataKey="jobs" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
