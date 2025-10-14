
import { notFound } from 'next/navigation';
import { getJobDetails } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, MapPin, Package, Calendar, Gauge, Wind, Fuel, Wrench, Coins } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center gap-4">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

const statusConfig = {
    finished: { label: "Finished", className: "bg-green-500" },
    ongoing: { label: "Ongoing", className: "bg-blue-500" },
    cancelled: { label: "Cancelled", className: "bg-red-500" },
};


export default async function JobDetailsPage({ params }: { params: { id: string } }) {
    const job = await getJobDetails(params.id);

    if (!job) {
        notFound();
    }

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/driver-hub/jobs/all">
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold">Job Details: #{job.id}</h1>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Truck />
                                {job.start_city} to {job.destination_city}
                            </CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                                {job.driver && (
                                    <div className="flex items-center gap-2">
                                        <Image src={job.driver.avatar} alt={job.driver.username} width={24} height={24} className="rounded-full" />
                                        <span>{job.driver.username}</span>
                                    </div>
                                )}
                                 <Badge className={statusConfig[job.status]?.className}>{statusConfig[job.status]?.label}</Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DetailItem icon={<MapPin size={24} />} label="From" value={`${job.start_company}, ${job.start_city}`} />
                    <DetailItem icon={<MapPin size={24} />} label="To" value={`${job.destination_company}, ${job.destination_city}`} />
                    <DetailItem icon={<Package size={24} />} label="Cargo" value={`${job.cargo} (${(job.cargo_mass / 1000).toFixed(1)}t)`} />
                    <DetailItem icon={<Calendar size={24} />} label="Distance" value={`${job.distance.toLocaleString()} km`} />
                    <DetailItem icon={<Gauge size={24} />} label="Average Speed" value={`${job.average_speed} km/h`} />
                    <DetailItem icon={<Wind size={24} />} label="Max Speed" value={`${job.max_speed} km/h`} />
                    <DetailItem icon={<Fuel size={24} />} label="Fuel Used" value={`${job.fuel_used.toLocaleString()} L`} />
                    <DetailItem icon={<Wrench size={24} />} label="Damage" value={`${job.damage}%`} />
                    <DetailItem icon={<Coins size={24} />} label="NXP Earned" value={job.xp.toLocaleString()} />
                </CardContent>
            </Card>
        </div>
    );
}
