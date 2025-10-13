
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Star, MapPin, CircleDollarSign, Package } from 'lucide-react';
import React from 'react';

type TruckersHubUser = {
    id: number;
    username: string;
    role: string;
    profile_id: string;
    rating: number;
    avatar: string;
    total_distance: number;
    total_revenue: number;
    total_jobs: number;
};

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
    const [user, setUser] = React.useState<TruckersHubUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setCurrentDate(format(new Date(), 'EEEE, MMMM dd, yyyy'));
        
        async function fetchUserData() {
            const apiKey = process.env.NEXT_PUBLIC_TRUCKERSHUB_API_KEY;
            if (!apiKey) {
                console.error("TRUCKERSHUB_API_KEY is not set.");
                setLoading(false);
                return;
            }
            try {
                // In a real app, you'd get the user ID from the login session
                const response = await fetch(`https://api.truckershub.in/v1/user/2228`, {
                     headers: { Authorization: apiKey }
                });
                if (response.ok) {
                    const data = await response.json();
                    if(data.status && data.response) {
                        setUser(data.response);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchUserData();

    }, []);
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <>
                {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" />)}
                {halfStar && <Star key="half" className="w-4 h-4 text-yellow-400/50" fill="currentColor" />}
                {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" fill="currentColor" />)}
            </>
        )
    }

    if (loading) {
         return <div className="p-4 md:p-8 space-y-8">Loading...</div>;
    }
    
    if (!user) {
        return <div className="p-4 md:p-8 space-y-8">Could not load user data.</div>;
    }


    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Welcome back, {user.username}</h1>
                        <div className="flex items-center flex-wrap gap-4 text-muted-foreground mt-1">
                            <span>Role • {user.role}</span>
                            <div className="flex items-center gap-1">
                                {renderStars(user.rating)}
                                <span className="text-sm ml-1">{user.rating.toFixed(1)}</span>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                            <Badge variant="outline">{user.profile_id}</Badge>
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
                   <p className="text-sm font-semibold tracking-widest text-muted-foreground">Tamil Pasanga Currency</p>
                   <div className="my-4">
                       <div className="text-xs text-muted-foreground">TOTAL BALANCE</div>
                       <div className="text-6xl font-bold text-white">0</div>
                   </div>
                </Card>

                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        icon={<MapPin className="h-6 w-6 text-blue-300" />}
                        title="Total Distance"
                        value={user.total_distance.toLocaleString()}
                        subtext="kilometers driven"
                        iconBgColor="bg-blue-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                     <StatCard 
                        icon={<CircleDollarSign className="h-6 w-6 text-green-300" />}
                        title="Total Revenue"
                        value={`₹${user.total_revenue.toLocaleString()}`}
                        subtext=""
                        iconBgColor="bg-green-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                     <StatCard 
                        icon={<Package className="h-6 w-6 text-orange-300" />}
                        title="Total Jobs"
                        value={user.total_jobs.toLocaleString()}
                        subtext="completed deliveries"
                        iconBgColor="bg-orange-500/20"
                        className="bg-card/80 backdrop-blur-sm border-border/20 shadow-lg"
                    />
                </div>
            </div>

        </div>
    );
}
