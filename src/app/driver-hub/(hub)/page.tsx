
import { getDashboardData } from '@/app/driver-hub/(hub)/actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Event } from '@/lib/events';
import eventsData from '@/lib/events.json';
import { DashboardClientPage } from '@/app/driver-hub/(hub)/dashboard-client';


const getNearestPartnerEvent = (): (Event & { image: any }) | null => {
    const partnerEvents = eventsData.events.filter(e => e.type === 'partner');
    if (partnerEvents.length === 0) return null;

    // Assuming events are sorted by date, find the next upcoming one
    // This logic might need to be improved if dates are not guaranteed to be sorted
    const upcoming = partnerEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const nearestEvent = upcoming[0];
    
    if (!nearestEvent) return null;
    
    const image = PlaceHolderImages.find(p => p.id === nearestEvent.imageId);
    return { ...nearestEvent, image };
};


export default async function DashboardPage() {
    const dashboardData = await getDashboardData();
    const nearestPartnerEvent = getNearestPartnerEvent();

    return (
        <DashboardClientPage 
            dashboardData={dashboardData} 
            nearestPartnerEvent={nearestPartnerEvent}
        />
    );
}
