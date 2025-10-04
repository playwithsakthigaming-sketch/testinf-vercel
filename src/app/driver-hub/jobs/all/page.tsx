
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
import { FilePlus2, ListFilter, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
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

const jobs = [
  {
    id: 1,
    game: 'ETS2',
    from: 'Prague',
    to: 'Duisburg',
    cargo: 'Medical Equipment',
    distance: '910 km',
    submitted: 'THIVEL',
    submittedAt: '2025-10-03',
  },
  {
    id: 2,
    game: 'ATS',
    from: 'Los Angeles',
    to: 'San Francisco',
    cargo: 'Electronics',
    distance: '615 km',
    submitted: 'Vasanth',
    submittedAt: '2025-10-02',
  },
   {
    id: 3,
    game: 'ETS2',
    from: 'Berlin',
    to: 'Warsaw',
    cargo: 'Car Parts',
    distance: '575 km',
    submitted: 'Rider46',
    submittedAt: '2025-10-01',
  },
];

const gameIcons = {
    ETS2: 'https://www.vectorlogo.zone/logos/eurotrucksimulator2/eurotrucksimulator2-icon.svg',
    ATS: 'https://static-00.iconduck.com/assets.00/american-truck-simulator-icon-2048x2048-22a4ig9k.png'
}

export default function AllJobsPage() {
  return (
    <div className="p-4 md:p-8">
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Jobs</CardTitle>
                        <CardDescription>
                        Overview of all jobs submitted by drivers.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search jobs..." className="pl-8 sm:w-[300px]" />
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                                </Button>
                            </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>
                                ETS2
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>ATS</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button asChild size="sm" className="h-9 gap-1">
                            <Link href="/driver-hub/jobs/submit">
                                <FilePlus2 className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Submit Job</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead>From → To</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Submitted by</TableHead>
                        <TableHead>Submitted At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow key={job.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Image src={gameIcons[job.game as keyof typeof gameIcons]} alt={`${job.game} logo`} width={20} height={20} />
                                        <Badge variant={job.game === 'ETS2' ? 'default' : 'secondary'}>{job.game}</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{job.from} → {job.to}</div>
                                </TableCell>
                                <TableCell>{job.cargo}</TableCell>
                                <TableCell>{job.distance}</TableCell>
                                <TableCell>{job.submitted}</TableCell>
                                <TableCell>{job.submittedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
