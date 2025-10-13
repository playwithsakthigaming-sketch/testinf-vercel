
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    chartData?: any[];
    chartColor: string;
    iconBgColor: string;
    hasChart?: boolean;
};

const StatCard = ({ icon, title, value, chartData, chartColor, iconBgColor, hasChart = false }: StatCardProps) => {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-sm text-muted-foreground">{title}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg", iconBgColor)}>
                       {icon}
                    </div>
                </div>
                {hasChart && chartData && (
                    <div className="h-16 mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`color-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColor}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#color-${title.replace(/\s+/g, '')})`}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
