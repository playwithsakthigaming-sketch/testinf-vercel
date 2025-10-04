
import { Construction } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="space-y-4">
          <Construction className="mx-auto h-16 w-16 text-primary" />
          <h1 className="text-4xl font-headline">Under Maintenance</h1>
          <p className="text-muted-foreground">
            This page is currently being updated. Please check back later.
          </p>
        </div>
    </div>
  );
}
