
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type Job = {
    job_id: number;
    created_at: string;
    driver: {
        username: string;
    };
    start_city: string;
    destination_city: string;
    cargo: string;
    cargo_weight: number;
    distance: number;
    ets2_nxp_total: number;
    ats_nxp_total: number;
    game: string;
    speed: string;
    damage: number;
};

type ApiResponse = {
    status: boolean;
    response: Job[];
};

async function getJobs(): Promise<Job[]> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TruckersHub API key is not set.");
        return [];
    }

    try {
        const res = await fetch('https://api.truckershub.in/v1/jobs', {
            headers: {
                'Authorization': apiKey,
            },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });

        if (!res.ok) {
            console.error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
            const errorBody = await res.text();
            console.error("Error body:", errorBody);
            return [];
        }

        const data: ApiResponse = await res.json();
        
        if (data.status && Array.isArray(data.response)) {
            return data.response;
        } else {
            console.error("Invalid API response structure:", data);
            return [];
        }

    } catch (error) {
        console.error("Error fetching jobs from TruckersHub:", error);
        return [];
    }
}


export default async function AllJobsPage() {
    const jobs = await getJobs();

  return (
    <div className="p-4 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>This Month Jobs</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <span className='text-sm'>Show</span>
                            <Select defaultValue='10'>
                                <SelectTrigger className='w-20'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className='text-sm'>entries</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-8 sm:w-[200px]" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>JOB ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>USER</TableHead>
                            <TableHead>FROM-TO</TableHead>
                            <TableHead>CARGO</TableHead>
                            <TableHead>DISTANCE</TableHead>
                            <TableHead>NXP</TableHead>
                            <TableHead>GAME</TableHead>
                            <TableHead>SPEED</TableHead>
                            <TableHead>DAMAGE</TableHead>
                            <TableHead className='text-right'>DETAILS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow key={job.job_id}>
                                <TableCell>{job.job_id}</TableCell>
                                <TableCell>
                                    <div>{format(parseISO(job.created_at), 'dd/MM/yyyy')}</div>
                                    <div className="text-muted-foreground text-xs">{format(parseISO(job.created_at), 'h:mm:ss a')}</div>
                                </TableCell>
                                <TableCell>{job.driver.username}</TableCell>
                                <TableCell>
                                    <div>{job.start_city}</div>
                                    <div>→ {job.destination_city}</div>
                                </TableCell>
                                <TableCell>
                                    <div>{job.cargo}</div>
                                    <div className="text-muted-foreground text-xs">({job.cargo_weight}t)</div>
                                </TableCell>
                                <TableCell>{job.distance} km</TableCell>
                                <TableCell>{job.game === 'ETS2' ? job.ets2_nxp_total : job.ats_nxp_total} NXP</TableCell>
                                <TableCell><Badge variant={job.game === 'ETS2' ? 'default' : 'secondary'}>{job.game}</Badge></TableCell>
                                <TableCell>{job.speed}</TableCell>
                                <TableCell>{job.damage}%</TableCell>
                                <TableCell className='text-right'>
                                    <Button size="sm" asChild>
                                        <Link href="#">Details</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {jobs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center">No jobs found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
             <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                    Showing 1 to {jobs.length > 10 ? 10 : jobs.length} of {jobs.length} entries
                </div>
                 <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    </div>
  );
}
