
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DriverHubPage() {
    const router = useRouter();

    React.useEffect(() => {
        router.replace('/driver-hub/dashboard');
    }, [router]);

    return (
        <div className="p-4 md:p-8 space-y-8">
            <p>Redirecting to dashboard...</p>
        </div>
    );
}

    