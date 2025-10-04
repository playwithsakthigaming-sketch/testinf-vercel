
import { notFound } from 'next/navigation';
import eventsData from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const getEvent = (id: string) => {
    const event = eventsData.events.find(e => e.id === id);
    if (!event) return undefined;

    const bannerImage = PlaceHolderImages.find(p => p.id === event.imageId);
    const routeImage = event.routeMapUrl ? { imageUrl: event.routeMapUrl, description: 'Route Map' } : undefined;

    const slotsWithImages = event.slots?.map(slot => {
        return {
            ...slot,
            image: { imageUrl: slot.imageUrl, description: slot.areaName }
        }
    })

    return {
        ...event,
        bannerImage,
        routeImage,
        slotsWithImages: slotsWithImages || []
    }
}

const DetailItem = ({ label, value }: { label: string, value: string | undefined | null }) => {
    if (!value) return null;
    return (
        <div>
            <p className="font-bold">{label}</p>
            <p className="text-muted-foreground">{value}</p>
        </div>
    );
};


export default function DriverHubEventDetailPage({ params }: { params: { id: string } }) {
    const event = getEvent(params.id);

    if (!event || event.type !== 'internal') {
        notFound();
    }
    
    return (
        <div className="p-4 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <DetailItem label="Game" value="ETS2" />
                            <DetailItem label="Server" value={event.server} />
                            <DetailItem label="Distance" value={event.attendees > 0 ? `${event.attendees}km` : `N/A`} />
                            <DetailItem label="Departure" value={event.departure} />
                            <DetailItem label="Destination" value={event.arrival} />
                            <DetailItem label="DLC Required" value="None" />
                            <DetailItem label="Time" value={event.meetupTime} />
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Button asChild>
                            <Link href={event.url} target="_blank">Mark Your Presence On TruckerMP</Link>
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
                    </div>

                    {event.slotsWithImages.map(slot => (
                        <div key={slot.id}>
                            <h3 className="text-xl font-bold mb-2">Slots - {slot.areaName}</h3>
                             {slot.image && (
                                <Image src={slot.image.imageUrl} alt={slot.image.description} width={800} height={450} className="rounded-lg object-cover w-full" />
                             )}
                        </div>
                    ))}
                    
                    {event.routeImage && (
                        <div>
                            <h3 className="text-xl font-bold mb-2">Route</h3>
                            <Image src={event.routeImage.imageUrl} alt={event.routeImage.description} width={800} height={450} className="rounded-lg object-cover w-full" />
                        </div>
                    )}
                     <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/driver-hub/events">Back to Events Calendar</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

