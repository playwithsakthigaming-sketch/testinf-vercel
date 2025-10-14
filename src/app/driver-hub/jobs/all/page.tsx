
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Truck, MapPin, Package, CheckCircle, AlertTriangle, PlayCircle } from "lucide-react";
import Image from "next/image";

type Job = {
    id: string;
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
    response: Job[];
};

async function getAllJobs(): Promise<Job[]> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return [];
    }

    try {
        const url = `https://api.truckershub.in/v1/jobs/all`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        
        if (!res.ok) {
            console.error("Failed to fetch jobs:", res.status, await res.text());
            return [];
        }

        const data: ApiResponse = await res.json();
        
        if (data && data.status && Array.isArray(data.response)) {
            return data.response;
        } else {
            if (data && Object.keys(data).length > 0 && !Array.isArray(data.response)) {
                console.error("Invalid API response structure for jobs:", data);
            }
            return [];
        }
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }
}

const statusConfig = {
    finished: { icon: <CheckCircle className="text-green-500" />, label: "Finished", color: "bg-green-500" },
    ongoing: { icon: <PlayCircle className="text-blue-500" />, label: "Ongoing", color: "bg-blue-500" },
    cancelled: { icon: <AlertTriangle className="text-red-500" />, label: "Cancelled", color: "bg-red-500" },
};


export default async function AllJobsPage() {
    const jobs = await getAllJobs();

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>A list of all jobs submitted by drivers in the VTC.</CardDescription>
                </CardHeader>
                <CardContent>
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
                            {jobs.length > 0 ? jobs.map((job) => (
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
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal size={16} />
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
