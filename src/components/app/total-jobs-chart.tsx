
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { ChartTooltipContent } from '@/components/ui/chart';

const data = [
  { type: 'Cargo Market', value: 120, fill: 'var(--color-cargo)' },
  { type: 'Freight Market', value: 90, fill: 'var(--color-freight)' },
  { type: 'External Contracts', value: 60, fill: 'var(--color-external)' },
  { type: 'Special Transport', value: 30, fill: 'var(--color-special)' },
];

export function TotalJobsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Tooltip
          content={<ChartTooltipContent nameKey="type" />}
          cursor={{ fill: 'hsl(var(--muted))' }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={80}
          paddingAngle={5}
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
