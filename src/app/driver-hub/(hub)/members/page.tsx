
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Driver } from "@/lib/truckershub-types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type ApiResponse = {
    status: boolean;
    response: {
        drivers: Driver[]
    };
};

async function getDrivers(): Promise<Driver[]> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return [];
    }

    try {
        const url = `https://api.truckershub.in/v1/drivers`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 3600 } // Revalidate every hour
        });
        
        if (!res.ok) {
            console.error("Failed to fetch drivers:", res.status, await res.text());
            return [];
        }

        const data: ApiResponse = await res.json();
        
        if (data && data.status && Array.isArray(data.response.drivers)) {
            return data.response.drivers;
        } else {
            console.error("Invalid API response structure for drivers:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching drivers:", error);
        return [];
    }
}

export default async function MembersPage() {
    const drivers = await getDrivers();

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>VTC Members</CardTitle>
                    <CardDescription>List of all drivers in the company.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Driver</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Total KM</TableHead>
                                <TableHead>Jobs Completed</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {drivers.map((driver) => (
                                <TableRow key={driver.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Image src={driver.avatar} alt={driver.username} width={40} height={40} className="rounded-full" />
                                            <span className="font-medium">{driver.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{driver.role.name}</Badge>
                                    </TableCell>
                                    <TableCell>{driver.total_km.toLocaleString()} km</TableCell>
                                    <TableCell>{driver.total_jobs.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
