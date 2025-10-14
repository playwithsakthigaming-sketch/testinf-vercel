
import React from 'react';
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, CheckCircle, XCircle, PauseCircle, Clock, Ticket } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getEventsWithBookings } from '../applications/server-actions';
import { UpdateBookingStatus } from '../applications/actions';
import type { Event, Booking } from '@/lib/events';
import { DeleteBookingDialog } from './delete-booking-dialog';

type BookingWithEventInfo = {
    booking: Booking;
    event: { id: string; title: string };
    area: { id: string; name: string };
};

const statusInfo = {
    approved: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, badge: <Badge className="bg-green-500 hover:bg-green-500/80">Approved</Badge> },
    pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, badge: <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Pending</Badge> },
    rejected: { icon: <XCircle className="h-4 w-4 text-red-500" />, badge: <Badge variant="destructive">Rejected</Badge> },
    hold: { icon: <PauseCircle className="h-4 w-4 text-orange-500" />, badge: <Badge className="bg-orange-500 hover:bg-orange-500/80">On Hold</Badge> },
};


function BookingRow({ item }: { item: BookingWithEventInfo }) {
    const { booking, event, area } = item;
    return (
        <TableRow>
            <TableCell className="font-medium">{booking.vtcName}</TableCell>
            <TableCell>{event.title}</TableCell>
            <TableCell>{area.name} - Slot #{booking.slotNumber}</TableCell>
            <TableCell>{statusInfo[booking.status]?.badge || booking.status}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <UpdateBookingStatus eventId={event.id} areaId={area.id} bookingId={booking.id} newStatus="approved" />
                       <UpdateBookingStatus eventId={event.id} areaId={area.id} bookingId={booking.id} newStatus="rejected" />
                       <UpdateBookingStatus eventId={event.id} areaId={area.id} bookingId={booking.id} newStatus="hold" />
                       <DropdownMenuSeparator />
                       <DeleteBookingDialog eventId={event.id} areaId={area.id} bookingId={booking.id} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export default async function BookingsAdminPage() {
    const events = await getEventsWithBookings();
    const allBookings = events.flatMap(event => 
        event.slots?.flatMap(area => 
            area.bookings?.map(booking => ({
                booking,
                event: { id: event.id, title: event.title },
                area: { id: area.id, name: area.areaName }
            })) || []
        ) || []
    );
    // Sort by pending status first, then by event
    allBookings.sort((a, b) => {
        if (a.booking.status === 'pending' && b.booking.status !== 'pending') return -1;
        if (a.booking.status !== 'pending' && b.booking.status === 'pending') return 1;
        return a.event.title.localeCompare(b.event.title);
    });

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-headline flex items-center gap-2">
                            <Ticket />
                           Slot Booking Requests
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>
                                {`${allBookings.length} booking request(s) found.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>VTC Name</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Slot</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                 <TableBody>
                                    {allBookings.length > 0 ? (
                                        allBookings.map((item) => (
                                            <BookingRow key={item.booking.id} item={item} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                No booking requests found.
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
