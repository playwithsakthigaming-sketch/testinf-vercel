
'use client';

import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Bell, HelpCircle, User, Truck, Calendar, Flame, Dot, Users, Settings, LogOut, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
import type { VtcStats, LeaderboardUser, Job } from '@/lib/truckershub-types';
import { getDashboardData } from './actions';


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

type DashboardPageProps = {
    stats: { vtc: VtcStats } | null;
    allTime: LeaderboardUser[] | null;
    monthly: LeaderboardUser[] | null;
    jobs: Job[] | null;
    user: { username: string } | null;
    nearestPartnerEvent: (Event & { image: any }) | null;
}

export default function DashboardPage({ dashboardData, nearestPartnerEvent }: { dashboardData: DashboardPageProps, nearestPartnerEvent: (Event & { image: any }) | null }) {
    const { stats, allTime, monthly, jobs, user } = dashboardData;
    const vtcStats = stats?.vtc;
    const allTimeLeaderboard: LeaderboardUser[] = allTime || [];
    const monthlyLeaderboard: LeaderboardUser[] = monthly || [];
    const recentJobs: Job[] = jobs || [];
    const username = user?.username || "Driver";

    return (
        <div className="p-4 md:p-8 space-y-6 bg-background text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-primary">Good Evening {username}</h1>
                <div className="flex items-center gap-4">
                    {/* Date is now handled on client to avoid hydration mismatch, or removed if not essential */}
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
                            <DropdownMenuItem asChild>
                                <Link href="/driver-hub/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
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
}
