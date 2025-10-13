
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Star, MapPin, CircleDollarSign, Package } from 'lucide-react';
import React from 'react';

const StatCard = ({ icon, title, value, subtext, iconBgColor, className }: { icon: React.ReactNode, title: string, value: string | number, subtext: string, iconBgColor: string, className?: string }) => (
    <Card className={className}>
        <CardContent className="p-4 flex items-center justify-between">
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${iconBgColor}`}>
                {icon}
            </div>
        </CardContent>
    </Card>
);

export default function DriverHubPage() {
    const [currentDate, setCurrentDate] = React.useState('');

    React.useEffect(() => {
        setCurrentDate(format(new Date(), 'EEEE, MMMM dd, yyyy'));
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826" alt="playwithsakthigaming" />
                        <AvatarFallback>PG</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Welcome back, playwithsakthigaming</h1>
                        <div className="flex items-center gap-4 text-muted-foreground mt-1">
                            <span>Role • rider</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                                <Star className="w-4 h-4 text-yellow-400/50" fill="currentColor" />
                                <span className="text-sm ml-1">4.8</span>
                            </div>
                            <Badge variant="outline">rider</Badge>
                            <Badge variant="outline">TNL-202510-IDQ5</Badge>
                        </div>
                    </div>
                </div>
                 <div className="text-right">
                    <p className="text-sm text-muted-foreground">Today's Date</p>
                    <p>{currentDate}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-600/20 text-center flex flex-col justify-center items-center p-6">
                   <p className="text-sm font-semibold tracking-widest text-muted-foreground">TN LOGISTICS CURRENCY</p>
                   <div className="my-4">
                       <div className="text-xs text-muted-foreground">TOTAL BALANCE</div>
                       <div className="text-6xl font-bold text-white">0</div>
                       <div className="text-lg font-semibold text-yellow-400">Roobai</div>
                   </div>
                </Card>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={<MapPin className="h-6 w-6 text-blue-300" />}
                        title="Total Distance"
                        value="0"
                        subtext="kilometers driven"
                        iconBgColor="bg-blue-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                     <StatCard 
                        icon={<CircleDollarSign className="h-6 w-6 text-green-300" />}
                        title="Total Revenue"
                        value="₹0"
                        subtext=""
                        iconBgColor="bg-green-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                     <StatCard 
                        icon={<Package className="h-6 w-6 text-orange-300" />}
                        title="Total Jobs"
                        value="0"
                        subtext="completed deliveries"
                        iconBgColor="bg-orange-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                </div>
            </div>

        </div>
    );
}
