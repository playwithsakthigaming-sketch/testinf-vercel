
'use client';

import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Bell, HelpCircle, User, Truck, Calendar, Flame, Dot, Users, Settings, LogOut } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import eventsData from '@/lib/events.json';
import type { Event } from '@/lib/events';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type VtcStats = {
    total_drivers: number;
    live_drivers: number;
    total_distance: number;
    total_jobs: number;
    total_fuel: number;
};

type LeaderboardUser = {
    username: string;
    value: number;
};

type Job = {
    id: string;
    driver: {
        username: string;
    };
    start_city: string;
    destination_city: string;
    cargo: string;
    cargo_mass: number;
    distance: number;
};

const StatCard = ({ title, value, icon, className = '' }: { title: string, value: string, icon: React.ReactNode, className?: string }) => (
    <Card className={`bg-card/80 backdrop-blur-sm ${className}`}>
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const monthlyJobsData = [
  { name: 'Jun', jobs: 2500 },
  { name: 'Jul', jobs: 2000 },
  { name: 'Aug', jobs: 1800 },
  { name: 'Sep', jobs: 1500 },
  { name: 'Oct', jobs: 500 },
];

const etsVsAtsData = [
  { name: 'ETS2', value: 44657 },
  { name: 'ATS', value: 7891 },
];
const goalData = [
  { name: 'Completed', value: 80 },
  { name: 'Left', value: 20 },
];
const COLORS = ['#3CB371', '#0d342f'];

const MilestoneIcon = ({ icon, color }: { icon: string, color: string }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${color}-500/20 text-${color}-400`}>
        <Dot/>
    </div>
);

// Helper to parse the date/time string from events.json
const parseDateTime = (dateTimeStr: string): Date | null => {
    try {
        const parts = dateTimeStr.split(' | ');
        if (parts.length < 2) return null; // Invalid format

        const datePart = parts[0];
        const timePart = parts[1];

        const [day, month, year] = datePart.split('.').map(Number);
        const [time, ] = timePart.split(' ');
        const [hour, minute] = time.split(':').map(Number);
        
        // Month is 0-indexed in JS Date
        return new Date(Date.UTC(year, month - 1, day, hour, minute));
    } catch {
        return null;
    }
};

const getNearestPartnerEvent = (): (Event & { image: any }) | null => {
    const partnerEvents = eventsData.events.filter(e => e.type === 'partner');
    const now = new Date();

    const upcomingEvents = partnerEvents
        .map(event => ({
            ...event,
            parsedDate: parseDateTime(event.meetupTime)
        }))
        .filter(event => event.parsedDate && event.parsedDate > now)
        .sort((a, b) => a.parsedDate!.getTime() - b.parsedDate!.getTime());

    if (upcomingEvents.length === 0) return null;
    
    const nearestEvent = upcomingEvents[0];
    const image = PlaceHolderImages.find(p => p.id === nearestEvent.imageId);

    return { ...nearestEvent, image };
}


export default function DashboardPage() {
    const [date, setDate] = React.useState<string | null>(null);
    const [vtcStats, setVtcStats] = React.useState<VtcStats | null>(null);
    const [username, setUsername] = React.useState<string>("Driver");
    const [allTimeLeaderboard, setAllTimeLeaderboard] = React.useState<LeaderboardUser[]>([]);
    const [monthlyLeaderboard, setMonthlyLeaderboard] = React.useState<LeaderboardUser[]>([]);
    const [recentJobs, setRecentJobs] = React.useState<Job[]>([]);
    
    const nearestPartnerEvent = React.useMemo(() => getNearestPartnerEvent(), []);

    React.useEffect(() => {
        const fetchData = async (endpoint: string) => {
            try {
                const res = await fetch(`/api/truckershub?endpoint=${endpoint}`);
                if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
                const data = await res.json();
                return data.response;
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        const fetchAllData = async () => {
            const [stats, allTime, monthly, jobs, user] = await Promise.all([
                fetchData('vtc'),
                fetchData('leaderboard/nxp'),
                fetchData('leaderboard/monthly_nxp'),
                fetchData('jobs/all?limit=5'),
                 fetchData('user'),
            ]);
            
            if (stats) setVtcStats(stats.vtc);
            if (allTime) setAllTimeLeaderboard(allTime);
            if (monthly) setMonthlyLeaderboard(monthly);
            if (jobs) setRecentJobs(jobs);
            if (user) setUsername(user.username);
        };
        
        fetchAllData();

        const updateDate = () => {
             setDate(new Date().toLocaleString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZoneName: 'short'
            }).replace(',', ''));
        };

        const intervalId = setInterval(updateDate, 1000);
        updateDate();

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-6 bg-background text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-primary">Good Evening {username}</h1>
                <div className="flex items-center gap-4">
                    {date && <span className="text-muted-foreground text-sm">{date}</span>}
                    <Badge variant="destructive"><Dot className="-ml-1" />Offline</Badge>
                    <Button variant="ghost" size="icon"><Bell size={18} /></Button>
                    <Button variant="ghost" size="icon"><HelpCircle size={18} /></Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-9 w-9 cursor-pointer">
                                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/driver-hub/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem asChild>
                                <Link href="/">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard title="Live" value={vtcStats?.live_drivers?.toString() || '...'} icon={<Truck size={24} />} />
                <StatCard title="Total Drivers" value={vtcStats?.total_drivers?.toString() || '...'} icon={<Users size={24} />} />
                <StatCard title="Distance" value={`${vtcStats?.total_distance?.toLocaleString() || '...'} kms`} icon={<Calendar size={24} />} />
                <StatCard title="Jobs" value={vtcStats?.total_jobs?.toLocaleString() || '...'} icon={<Truck size={24} />} />
                <StatCard title="Fuel Burned" value={`${vtcStats?.total_fuel?.toLocaleString() || '...'} l`} icon={<Flame size={24} />} />
            </div>

            {/* Upcoming Event */}
            {nearestPartnerEvent && nearestPartnerEvent.image && (
                <Card className="relative overflow-hidden bg-transparent border-0">
                    <Image src={nearestPartnerEvent.image.imageUrl} alt={nearestPartnerEvent.title} layout="fill" objectFit="cover" className="z-0" />
                    <div className="absolute inset-0 bg-black/50"/>
                    <CardContent className="relative z-10 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pink-300">Upcoming Partner Event</p>
                            <h2 className="text-xl font-bold mt-1">{nearestPartnerEvent.title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{nearestPartnerEvent.meetupTime}</p>
                        </div>
                         <Button asChild>
                            <Link href={nearestPartnerEvent.url} target="_blank">Details</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Celestial Milestone Tracker */}
            <Card className="bg-card/80">
                <CardHeader>
                    <CardTitle className="text-center text-lg">Celestial Milestone Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground text-sm mb-4">
                        Together, Tamil pasanga Drivers have journeyed incredible distances pushing boundaries, breaking limits, and truly proving our slogan: "Gateway to New Horizons."
                    </p>
                    <div className="flex justify-around items-center">
                        <MilestoneIcon icon="earth" color="green" />
                        <div className="flex-grow h-1 bg-green-500/30 rounded-full mx-2 relative">
                            <div className="absolute top-0 left-0 h-1 bg-green-500 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <MilestoneIcon icon="meteor" color="orange" />
                        <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="rocket" color="purple" />
                         <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="comet" color="red" />
                         <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="ufo" color="teal" />
                         <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="galaxy" color="indigo" />
                         <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="sun" color="yellow" />
                         <div className="flex-grow h-1 bg-gray-700 rounded-full mx-2" />
                        <MilestoneIcon icon="blackhole" color="gray" />
                    </div>
                </CardContent>
            </Card>
            
            {/* Charts and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-card/80">
                    <CardHeader>
                        <CardTitle>Monthly Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyJobsData}>
                                <defs>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3CB371" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3CB371" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="jobs" stroke="#3CB371" fillOpacity={1} fill="url(#colorJobs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <div className="grid grid-cols-1 gap-6">
                     <Card className="bg-card/80">
                        <CardHeader><CardTitle>Jobs This Month</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">289</p>
                            <p className="text-sm text-muted-foreground">Previous Month: 1138</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/80">
                        <CardHeader><CardTitle>ETS2 V/S ATS Jobs</CardTitle></CardHeader>
                         <CardContent className="h-[150px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={etsVsAtsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                                        {etsVsAtsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                         </CardContent>
                    </Card>
                </div>
            </div>

            <Card className="bg-card/80">
                <CardHeader><CardTitle>Monthly Goals</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Distance Goal', 'Jobs Goal', 'Income Goal'].map(goal => (
                        <div key={goal}>
                            <h3 className="text-center font-semibold mb-2">{goal}</h3>
                            <div className="h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={goalData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} startAngle={90} endAngle={450}>
                                            {goalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/80">
                    <CardHeader><CardTitle>All Time</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {allTimeLeaderboard.slice(0, 5).map((user, index) => (
                                <li key={user.username} className="flex justify-between items-center text-sm">
                                    <span>{index + 1}) {user.username}</span>
                                    <span className="font-semibold">{user.value.toLocaleString()} NXP</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="bg-card/80">
                    <CardHeader><CardTitle>This Month</CardTitle></CardHeader>
                    <CardContent>
                         <ul className="space-y-3">
                            {monthlyLeaderboard.slice(0, 5).map((user, index) => (
                                <li key={user.username} className="flex justify-between items-center text-sm">
                                    <span>{index + 1}) {user.username}</span>
                                    <span className="font-semibold">{user.value.toLocaleString()} NXP</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Jobs */}
            <Card className="bg-card/80">
                <CardHeader><CardTitle>Recent Jobs</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead>From-To</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Cargo Mass</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentJobs.map(job => (
                                <TableRow key={job.id}>
                                    <TableCell>{job.id}</TableCell>
                                    <TableCell>{job.driver.username}</TableCell>
                                    <TableCell>{job.start_city} - {job.destination_city}</TableCell>
                                    <TableCell>{job.cargo}</TableCell>
                                    <TableCell>{(job.cargo_mass / 1000).toFixed(1)} t</TableCell>
                                    <TableCell>{job.distance} km</TableCell>
                                    <TableCell><Button variant="outline" size="sm">Details</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );

    