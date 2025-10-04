
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from '@/components/ui/button';
import { Event } from '@/lib/events';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type CalendarEvent = {
  title: string;
  start: string;
  url?: string;
  backgroundColor: string;
  borderColor: string;
};

const parseDate = (dateStr: string): Date | null => {
    // Format: "DD.MM.YYYY | HH:mm ZZZ"
    const parts = dateStr.split(' | ');
    if (parts.length < 2) return null;

    const dateParts = parts[0].split('.');
    if (dateParts.length < 3) return null;
    
    const [day, month, year] = dateParts;
    const timePart = parts[1].split(' ')[0];
    const [hour, minute] = timePart.split(':');

    // Note: Month is 0-indexed in JS Date
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)));
    
    return isNaN(date.getTime()) ? null : date;
};


export function DriverHubCalendar({ events }: { events: Event[] }) {
    const calendarRef = useRef<FullCalendar>(null);
    const router = useRouter();

    const calendarEvents: CalendarEvent[] = events.map(event => {
        const startDate = parseDate(event.meetupTime);
        return {
            title: event.title,
            start: startDate ? startDate.toISOString() : new Date().toISOString(),
            url: event.type === 'internal' ? `/events/${event.id}` : event.url,
            backgroundColor: event.type === 'internal' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
            borderColor: event.type === 'internal' ? 'hsl(var(--accent))' : 'hsl(var(--border))',
        };
    }).filter(e => e.start);

    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.updateSize();
        }
    }, []);

    const handleEventClick = (info: any) => {
        info.jsEvent.preventDefault(); // Prevent the default link behavior
        if (info.event.url) {
            if(info.event.url.startsWith('/')) {
                router.push(info.event.url);
            } else {
                window.open(info.event.url, '_blank');
            }
        }
    };


  return (
    <div className="p-4 rounded-lg text-sm" id="calendar">
      <style>{`
        #calendar .fc-toolbar-title { font-size: 1.5rem; }
        #calendar .fc-button { background-color: hsl(var(--primary)); border-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); }
        #calendar .fc-button:hover { background-color: hsl(var(--primary)) / 0.9; }
        #calendar .fc-button-primary:not(:disabled).fc-button-active { background-color: hsl(var(--accent)); border-color: hsl(var(--accent)); }
        #calendar .fc-daygrid-day.fc-day-today { background-color: hsl(var(--card)); }
        #calendar .fc-daygrid-day-number { color: hsl(var(--foreground)); }
        #calendar .fc-col-header-cell-cushion { color: hsl(var(--foreground)); }
        #calendar .fc-event { padding: 4px; font-size: 0.8rem; cursor: pointer; }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={calendarEvents}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="auto"
      />
    </div>
  );
}

