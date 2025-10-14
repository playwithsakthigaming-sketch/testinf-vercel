
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, MapPin, CheckCircle, AlertTriangle, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Job = {
    id: number;
    driver: {
        id: number;
        username: string;
        avatar: string;
    };
    start_city: string;
    start_company: string;
    destination_city: string;
    destination_company: string;
    cargo: string;
    cargo_mass: number;
    distance: number;
    fuel_used: number;
    money_made: number;
    status: 'finished' | 'ongoing' | 'cancelled';
    xp: number;
    max_speed: number;
    average_speed: number;
    damage: number;
};

type ApiResponse = {
    status: boolean;
    response: Job[] | {};
};

async function getJobs(month?: string, year?: string): Promise<Job[]> {
    const apiKey = process.env.NEXT_PUBLIC_TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return [];
    }

    try {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        
        const queryString = params.toString();
        const url = `https://api.truckershub.in/v1/jobs/all${queryString ? `?${queryString}` : ''}`;
        
        // We'll use a client-side fetch and need a proxy to avoid CORS issues if the key is secret
        // For now, assuming the API can be called client-side or this will be moved to a route handler
        const res = await fetch(`/api/truckershub?endpoint=jobs/all${queryString ? `&${queryString}` : ''}`);

        if (!res.ok) {
            console.error("Failed to fetch jobs:", res.status, await res.text());
            return [];
        }

        const data: ApiResponse = await res.json();
        
        if (data && data.status) {
            if (Array.isArray(data.response)) {
                return data.response;
            }
            if (typeof data.response === 'object' && Object.keys(data.response).length === 0) {
                return [];
            }
        }
        
        // Avoid logging an error for an empty object response, which means no jobs
        if (typeof data.response === 'object' && Object.keys(data.response).length > 0) {
             console.error("Invalid API response structure for jobs:", data);
        }
        return [];

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

const statusConfig = {
    finished: { icon: <CheckCircle className="text-green-500" />, label: "Finished" },
    ongoing: { icon: <PlayCircle className="text-blue-500" />, label: "Ongoing" },
    cancelled: { icon: <AlertTriangle className="text-red-500" />, label: "Cancelled" },
};

const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
];

const years = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));


export default function AllJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [month, setMonth] = useState<string | undefined>(undefined);
    const [year, setYear] = useState<string | undefined>(undefined);

    const fetchJobs = async (m?: string, y?: string) => {
        setIsLoading(true);
        const jobsData = await getJobs(m, y);
        setJobs(jobsData);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleFilter = () => {
        fetchJobs(month, year);
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>A list of all jobs submitted by drivers in the VTC.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleFilter} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Filter
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Driver</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Distance</TableHead>
                                <TableHead>NXP</TableHead>
                                <TableHead>Damage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : jobs.length > 0 ? jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {job.driver && (
                                                <>
                                                    <Image src={job.driver.avatar} alt={job.driver.username} width={32} height={32} className="rounded-full" />
                                                    <span>{job.driver.username}</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-muted-foreground"/>
                                            <span>{job.start_city} to {job.destination_city}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                             <Package size={16} className="text-muted-foreground"/>
                                            <span>{job.cargo}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{job.distance.toLocaleString()} km</TableCell>
                                    <TableCell>{job.xp}</TableCell>
                                    <TableCell>
                                        <Badge variant={job.damage > 0 ? "destructive" : "default"} className={job.damage === 0 ? "bg-green-500" : ""}>
                                            {job.damage}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {statusConfig[job.status]?.icon}
                                            {statusConfig[job.status]?.label}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/driver-hub/jobs/${job.id}`}>Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center">
                                        No jobs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
