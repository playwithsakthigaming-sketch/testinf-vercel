
import { Card, CardContent } from '@/components/ui/card';
import { DriverHubCalendar } from '@/components/app/driver-hub-calendar';
import { getEvents } from './actions';

export default async function EventsPage() {
  const events = await getEvents();
  
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardContent className="p-0">
            <DriverHubCalendar events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
