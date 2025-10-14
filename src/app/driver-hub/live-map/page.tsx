
import { LiveMapClient } from './live-map-client';

export default function LiveMapPage() {
    return (
        <div className="h-[calc(100vh_-_var(--header-height,4rem))]">
            <LiveMapClient />
        </div>
    );
}
