
'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import eventsData from '@/lib/events.json';
import { useRouter } from 'next/navigation';

type CalendarEvent = {
    title: string;
    start: Date;
    allDay: boolean;
    extendedProps: {
        id: string;
    };
    backgroundColor: string;
    borderColor: string;
};

// Helper to parse the date/time string from events.json
const parseDateTime = (dateTimeStr: string): Date | null => {
    const parts = dateTimeStr.split(' | ');
    if (parts.length < 2) return null; // Invalid format

    const datePart = parts[0];
    const timePart = parts[1];

    const [day, month, year] = datePart.split('.').map(Number);
    const [time, ] = timePart.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    // Month is 0-indexed in JS Date
    return new Date(year, month - 1, day, hour, minute);
};


export default function DriverHubEventsPage() {
    const router = useRouter();

    const formattedEvents: CalendarEvent[] = eventsData.events.map(event => {
        const start = parseDateTime(event.meetupTime);
        const isInternal = event.type === 'internal';

        return {
            title: event.title,
            start: start || new Date(event.date),
            allDay: false, // Assuming events are at specific times
            extendedProps: { id: event.id },
            backgroundColor: isInternal ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
            borderColor: isInternal ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
        };
    }).filter(e => e.start !== null);

    const handleEventClick = (clickInfo: any) => {
        const eventId = clickInfo.event.extendedProps.id;
        router.push(`/driver-hub/events/${eventId}`);
    };

    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardContent className="p-4">
                     <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={formattedEvents}
                        eventClick={handleEventClick}
                        height="auto"
                        contentHeight="auto"
                        aspectRatio={1.5}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                     />
                </CardContent>
            </Card>
        </div>
    );
}
