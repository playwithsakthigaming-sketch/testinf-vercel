
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
import { ListFilter, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


const jobs = [
  {
    jobId: 1064147,
    date: '10/4/2025',
    time: '4:48:20 AM',
    user: 'SK Setia',
    from: 'Košice',
    to: 'Pécs',
    cargo: 'Almond',
    cargoWeight: 171,
    distance: '557 km',
    nxp: 460,
    game: 'ETS2',
    speed: 'Real',
    damage: '0%',
  },
  {
    jobId: 1063888,
    date: '10/4/2025',
    time: '2:08:27 AM',
    user: 'Boofi_Softie',
    from: 'Milano',
    to: 'Zürich',
    cargo: 'Mercuric Chloride',
    cargoWeight: 111,
    distance: '611 km',
    nxp: 484,
    game: 'ETS2',
    speed: 'Real',
    damage: '1%',
  },
  {
    jobId: 1063794,
    date: '10/4/2025',
    time: '1:33:01 AM',
    user: 'nabeelthakur8',
    from: 'Calais',
    to: 'Duisburg',
    cargo: 'Fireworks',
    cargoWeight: 161,
    distance: '424 km',
    nxp: 305,
    game: 'ETS2',
    speed: 'Real',
    damage: '10%',
  },
  {
    jobId: 1063767,
    date: '10/4/2025',
    time: '1:22:06 AM',
    user: 'Suraj_11',
    from: 'Călărași',
    to: 'Pamplona',
    cargo: 'Mercuric Chloride',
    cargoWeight: 221,
    distance: '1,805 km',
    nxp: 1430,
    game: 'ETS2',
    speed: 'Real',
    damage: '1%',
  },
  {
    jobId: 1063630,
    date: '10/4/2025',
    time: '12:26:17 AM',
    user: 'nabeelthakur8',
    from: 'Bilbao',
    to: 'Barcelona',
    cargo: 'Motor Oil',
    cargoWeight: 201,
    distance: '570 km',
    nxp: 456,
    game: 'ETS2',
    speed: 'Real',
    damage: '0%',
  },
  {
    jobId: 1063480,
    date: '10/3/2025',
    time: '11:03:34 PM',
    user: 'DEV ALONE',
    from: 'Oslo',
    to: 'Kristiansund',
    cargo: 'Goat Cheese',
    cargoWeight: 161,
    distance: '680 km',
    nxp: 561,
    game: 'ETS2',
    speed: 'Real',
    damage: '0%',
  },
   {
    jobId: 1063443,
    date: '10/3/2025',
    time: '10:41:02 PM',
    user: 'Swamfire Gaming',
    from: 'Klagenfurt am Wörthersee',
    to: 'Duisburg',
    cargo: 'Chocolate',
    cargoWeight: 241,
    distance: '1,029 km',
    nxp: 815,
    game: 'ETS2',
    speed: 'Real',
    damage: '0%',
  },
];


export default function AllJobsPage() {
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
                            <TableRow key={job.jobId}>
                                <TableCell>{job.jobId}</TableCell>
                                <TableCell>
                                    <div>{job.date}</div>
                                    <div className="text-muted-foreground text-xs">{job.time}</div>
                                </TableCell>
                                <TableCell>{job.user}</TableCell>
                                <TableCell>
                                    <div>{job.from}</div>
                                    <div>→ {job.to}</div>
                                </TableCell>
                                <TableCell>
                                    <div>{job.cargo}</div>
                                    <div className="text-muted-foreground text-xs">({job.cargoWeight})</div>
                                </TableCell>
                                <TableCell>{job.distance}</TableCell>
                                <TableCell>{job.nxp} NXP</TableCell>
                                <TableCell><Badge variant={job.game === 'ETS2' ? 'default' : 'secondary'}>{job.game}</Badge></TableCell>
                                <TableCell>{job.speed}</TableCell>
                                <TableCell>{job.damage}</TableCell>
                                <TableCell className='text-right'>
                                    <Button size="sm" asChild>
                                        <Link href="#">Details</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                    Showing 1 to 10 of 61 entries
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
                        <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
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
