
import React from 'react';
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Application } from "@/lib/applications";
import { CheckCircle, Clock, FileText, MoreHorizontal, XCircle, Link as LinkIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { UpdateApplicationStatus } from "./actions";
import { getApplications } from './server-actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeleteApplicationDialog } from './delete-application-dialog';


const statusInfo = {
    Accepted: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, badge: <Badge variant="default" className="bg-green-500">Accepted</Badge> },
    Pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, badge: <Badge variant="secondary" className="bg-yellow-500">Pending</Badge> },
    Rejected: { icon: <XCircle className="h-4 w-4 text-red-500" />, badge: <Badge variant="destructive">Rejected</Badge> },
};


function ApplicationRow({ app }: { app: Application }) {
    return (
        <TableRow>
            <TableCell className="font-medium">{app.id}</TableCell>
            <TableCell>{app.name}</TableCell>
            <TableCell>{app.email}</TableCell>
            <TableCell>
                <div className="flex gap-2 items-center">
                    {app.steamUrl && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={app.steamUrl} target="_blank"><Button variant="outline" size="icon" className="h-8 w-8"><LinkIcon size={16}/></Button></Link>
                                </TooltipTrigger>
                                <TooltipContent>Steam Profile</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                     {app.truckersmpUrl && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={app.truckersmpUrl} target="_blank"><Button variant="outline" size="icon" className="h-8 w-8"><ExternalLink size={16}/></Button></Link>
                                </TooltipTrigger>
                                <TooltipContent>TruckersMP Profile</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                    {app.truckershubUrl && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                     <Link href={app.truckershubUrl} target="_blank"><Button variant="outline" size="icon" className="h-8 w-8"><ExternalLink size={16}/></Button></Link>
                                </TooltipTrigger>
                                <TooltipContent>TruckersHub Profile</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </TableCell>
            <TableCell>{format(new Date(app.submittedAt), 'dd/MM/yyyy HH:mm')}</TableCell>
            <TableCell>{statusInfo[app.status]?.badge || app.status}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <UpdateApplicationStatus applicationId={app.id} status="Accepted" currentStatus={app.status} />
                        <UpdateApplicationStatus applicationId={app.id} status="Rejected" currentStatus={app.status} />
                        <DropdownMenuSeparator />
                        <DeleteApplicationDialog applicationId={app.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default async function ApplicationsAdminPage() {
    const applications = await getApplications();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-headline flex items-center gap-2">
                            <FileText />
                            Manage Applications
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Driver Hub Applications</CardTitle>
                            <CardDescription>
                                {`${applications.length} application(s) found.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Profiles</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.length > 0 ? (
                                        applications.map((app) => (
                                            <ApplicationRow key={app.id} app={app} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">
                                                No applications found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                     <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/admin">Back to Admin</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
