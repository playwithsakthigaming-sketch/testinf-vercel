
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Truck, Fuel, BarChart, Calendar, Milestone, Users, Star, Trophy, Clock } from 'lucide-react';
import { MonthlyJobChart } from '@/components/app/monthly-job-chart';
import { TotalJobsChart } from '@/components/app/total-jobs-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import events from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

type StatCardProps = {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
};

const StatCard = ({ icon, title, value, change, changeType }: StatCardProps) => (
    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-primary">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
                 <p className="text-xs text-muted-foreground">
                    <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>{change}</span> from last month
                </p>
            )}
        </CardContent>
    </Card>
);

const fetchCompanyStats = async () => {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }

    try {
        const url = `https://api.truckershub.in/v1/company/stats`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 3600 } // Revalidate every hour
        });
        
        if (!res.ok) {
            console.error("Failed to fetch company stats:", res.status, await res.text());
            return null;
        }

        const data = await res.json();
        
        if (data && data.status && data.response) {
            return data.response.company;
        } else {
            console.error("Invalid API response structure for company stats:", data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching company stats:", error);
        return null;
    }
};


export default async function DriverHubPage() {
    const stats = await fetchCompanyStats();
    
    const upcomingEvent = events.events[0];
    const eventImage = PlaceHolderImages.find(p => p.id === upcomingEvent.imageId);

    const totalDistance = stats ? (stats.total_distance / 1000).toFixed(2) : 'N/A';
    const fuelConsumed = stats ? (stats.fuel_consumed).toLocaleString() : 'N/A';
    const jobsThisMonth = stats ? stats.jobs_this_month : 'N/A';
    const jobsLastMonth = stats ? stats.jobs_last_month : 'N/A';
    const changePercentage = (stats && stats.jobs_last_month > 0) 
        ? (((stats.jobs_this_month - stats.jobs_last_month) / stats.jobs_last_month) * 100).toFixed(1)
        : '0';

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Welcome, Driver!</h1>
                    <p className="text-muted-foreground">Here is your overview for today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Driver Avatar" />
                        <AvatarFallback>TP</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">John Doe</p>
                        <Badge variant="outline" className="border-primary text-primary">Pro Driver</Badge>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Truck />} title="Total Distance" value={`${totalDistance} km`} />
                <StatCard icon={<Fuel />} title="Fuel Consumed" value={`${fuelConsumed} L`} />
                <StatCard 
                    icon={<BarChart />} 
                    title="Jobs This Month" 
                    value={jobsThisMonth} 
                    change={`${changePercentage}%`} 
                    changeType={parseFloat(changePercentage) >= 0 ? 'increase' : 'decrease'} 
                />
                <StatCard icon={<Calendar />} title="Jobs Last Month" value={jobsLastMonth} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Upcoming Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {upcomingEvent && (
                            <div className="space-y-4">
                                {eventImage && (
                                    <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                        <Image src={eventImage.imageUrl} alt={eventImage.description} fill className="object-cover" />
                                    </div>
                                )}
                                <h3 className="font-semibold">{upcomingEvent.title}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock size={16} /> {upcomingEvent.date}
                                </p>
                                <Button className="w-full" asChild>
                                    <Link href={`/events/${upcomingEvent.id}`}>View Details</Link>
                                </Button>
                            </div>
                       )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Celestial Milestone Tracker</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-card-foreground/5">
                            <Milestone size={40} className="text-primary" />
                            <div>
                                <p className="font-bold text-lg">You've driven 150,000 KM!</p>
                                <p className="text-sm text-muted-foreground">Only 50,000 KM to the next milestone: "Cosmic Voyager".</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-2 rounded-lg bg-card-foreground/5">
                                <Users size={24} className="mx-auto mb-2 text-primary" />
                                <p className="font-semibold">Top 10%</p>
                                <p className="text-xs text-muted-foreground">Community Rank</p>
                            </div>
                             <div className="p-2 rounded-lg bg-card-foreground/5">
                                <Star size={24} className="mx-auto mb-2 text-primary" />
                                <p className="font-semibold">3</p>
                                <p className="text-xs text-muted-foreground">Awards Won</p>
                            </div>
                             <div className="p-2 rounded-lg bg-card-foreground/5">
                                <Trophy size={24} className="mx-auto mb-2 text-primary" />
                                <p className="font-semibold">5th</p>
                                <p className="text-xs text-muted-foreground">Monthly Rank</p>
                            </div>
                             <div className="p-2 rounded-lg bg-card-foreground/5">
                                <Calendar size={24} className="mx-auto mb-2 text-primary" />
                                <p className="font-semibold">12</p>
                                <p className="text-xs text-muted-foreground">Events Attended</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Jobs This Month vs. Last Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MonthlyJobChart thisMonth={Number(jobsThisMonth)} lastMonth={Number(jobsLastMonth)} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Jobs by Type (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TotalJobsChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
