
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, MapPin, Milestone, Route, CircleDollarSign, Star, Truck } from 'lucide-react';
import StatCard from '@/components/app/stat-card';

const chartData = [
    { value: 10 }, { value: 20 }, { value: 15 }, { value: 30 },
    { value: 25 }, { value: 40 }, { value: 35 },
];

type CompanyStats = {
    total_drivers: number;
    online_drivers: number;
    total_distance: number;
    avg_delivery: number;
    longest_delivery: number;
    money_earned: number;
    total_jobs: number;
    company_thp: number;
};

async function fetchCompanyStats(): Promise<CompanyStats | null> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }

    try {
        const url = `https://api.truckershub.in/v1/company/stats`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        
        if (!res.ok) {
            console.error("Failed to fetch company stats:", res.status, await res.text());
            return null;
        }

        const data = await res.json();
        
        if (data && data.status && data.response && data.response.company) {
            return data.response.company;
        } else {
             if (data && Object.keys(data).length > 0 && JSON.stringify(data) !== '{}') {
                console.error("Invalid API response structure for company stats:", data);
            }
            return null;
        }
    } catch (error) {
        console.error("Error fetching company stats:", error);
        return null;
    }
}

// Helper to format large numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return String(num);
};

export default async function DriverHubPage() {
    const stats = await fetchCompanyStats();

    const statsCards = [
        {
            icon: <Activity className="h-5 w-5 text-white" />,
            title: "Online Drivers",
            value: stats ? stats.online_drivers : 0,
            iconBgColor: "bg-blue-500",
        },
        {
            icon: <Users className="h-5 w-5 text-white" />,
            title: "Total Drivers",
            value: stats ? stats.total_drivers : 0,
            iconBgColor: "bg-red-500",
        },
        {
            icon: <MapPin className="h-5 w-5 text-white" />,
            title: "Average Distance",
            value: stats ? `${stats.avg_delivery} km` : '0 km',
            iconBgColor: "bg-green-500",
        },
        {
            icon: <Milestone className="h-5 w-5 text-white" />,
            title: "Longest Distance",
            value: stats ? `${formatNumber(stats.longest_delivery)} km` : '0 km',
            iconBgColor: "bg-teal-500",
        }
    ];

    const chartStatCards = [
         {
            icon: <Route className="h-6 w-6 text-white" />,
            title: "Distance",
            value: stats ? `${formatNumber(stats.total_distance)} km` : '0 km',
            chartData: chartData,
            chartColor: "#34D399",
            iconBgColor: "bg-green-500",
        },
        {
            icon: <CircleDollarSign className="h-6 w-6 text-white" />,
            title: "Revenue",
            value: stats ? `₹${formatNumber(stats.money_earned)}` : '₹0',
            chartData: chartData.slice().reverse(),
            chartColor: "#60A5FA",
            iconBgColor: "bg-blue-500",
        },
        {
            icon: <Star className="h-6 w-6 text-white" />,
            title: "TruckersHub Points",
            value: stats ? `${formatNumber(stats.company_thp)} THP` : '0 THP',
            chartData: chartData,
            chartColor: "#3B82F6",
            iconBgColor: "bg-sky-500",
        },
        {
            icon: <Truck className="h-6 w-6 text-white" />,
            title: "Jobs Delivered",
            value: stats ? formatNumber(stats.total_jobs) : 0,
            chartData: chartData.slice().reverse(),
            chartColor: "#F87171",
            iconBgColor: "bg-red-500",
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Welcome, Driver!</h1>
                    <p className="text-muted-foreground">Here is your overview for today.</p>
                </div>
            </div>

            {/* Top Row Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((card) => (
                    <StatCard
                        key={card.title}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        iconBgColor={card.iconBgColor}
                        chartColor="" // Not used here
                    />
                ))}
            </div>

            {/* Bottom Row Stats with Charts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {chartStatCards.map((card) => (
                    <StatCard
                        key={card.title}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        chartData={card.chartData}
                        chartColor={card.chartColor}
                        iconBgColor={card.iconBgColor}
                        hasChart
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Recent jobs and events will be displayed here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
