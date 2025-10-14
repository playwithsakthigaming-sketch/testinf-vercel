
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
}

export function DashboardClientPage({ dashboardData, nearestPartnerEvent }: { dashboardData: DashboardPageProps | null, nearestPartnerEvent: (Event & { image: any }) | null }) {
    if (!dashboardData) {
        return <div className="p-8 text-center"><Loader2 className="mx-auto h-12 w-12 animate-spin" /> <p className="mt-4">Loading dashboard...</p></div>;
    }
    const { stats, allTime, monthly, jobs, user } = dashboardData;
    const vtcStats = stats?.vtc;
    const allTimeLeaderboard: LeaderboardUser[] = allTime || [];
    const monthlyLeaderboard: LeaderboardUser[] = monthly || [];
    const recentJobs: Job[] = jobs || [];
    const username = user?.username || "Driver";
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-truck');

    return (
        <div className="p-4 md:p-8 space-y-6 bg-background text-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-primary">Good Evening {username}</h1>
                <div className="flex items-center gap-4">
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

            {/* Hero Section */}
            {heroImage &&
                <Card className="relative overflow-hidden bg-card border-0 h-64">
                        <Image src={heroImage.imageUrl} alt={heroImage.description} layout="fill" objectFit="cover" className="z-0" />
                        <div className="absolute inset-0 bg-black/60"/>
                        <CardContent className="relative z-10 p-6 flex flex-col justify-center h-full text-center items-center">
                            <h2 className="text-4xl font-headline font-bold text-white">Welcome to Tamil Pasanga VTC</h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl">The premier virtual trucking company where passion for the open road meets a vibrant community spirit. Great Experience, We Believe In Quality Not Quantity</p>
                        </CardContent>
                </Card>
            }


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Jobs" value={vtcStats?.total_jobs?.toLocaleString() || '...'} icon={<Truck size={24} />} />
                <StatCard title="Total Distance" value={`${vtcStats?.total_distance?.toLocaleString() || '...'} kms`} icon={<Calendar size={24} />} />
                <StatCard title="Active Drivers" value={vtcStats?.total_drivers?.toString() || '...'} icon={<Users size={24} />} />
            </div>

            {/* Upcoming Event */}
            {nearestPartnerEvent && nearestPartnerEvent.image && (
                <Card className="relative overflow-hidden bg-transparent border-0">
                    <Image src={nearestPartnerEvent.image.imageUrl} alt={nearestPartnerEvent.title} layout="fill" objectFit="cover" className="z-0" />
                    <div className="absolute inset-0 bg-black/50"/>
                    <CardHeader>
                        <CardTitle>Latest Event Highlights</CardTitle>
                    </CardHeader>
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
        </div>
    );
}
