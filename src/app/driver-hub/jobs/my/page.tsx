
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, MapPin, CheckCircle, AlertTriangle, PlayCircle } from "lucide-react";
import Link from 'next/link';

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

async function getMyJobs(): Promise<Job[]> {
    try {
        const res = await fetch(`/api/truckershub?endpoint=jobs`);

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


export default function MyJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            const jobsData = await getMyJobs();
            setJobs(jobsData);
            setIsLoading(false);
        };
        fetchJobs();
    }, []);

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Jobs</CardTitle>
                    <CardDescription>A list of all jobs you have personally submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                                    <TableCell colSpan={7} className="text-center h-24">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : jobs.length > 0 ? jobs.map((job) => (
                                <TableRow key={job.id}>
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
                                    <TableCell colSpan={7} className="text-center">
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
