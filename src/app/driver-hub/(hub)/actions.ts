
'use server';

import type { VtcStats, LeaderboardUser, Job } from '@/lib/truckershub-types';

type TruckersHubResponse<T> = {
    status: boolean;
    response: T;
};

async function fetchTruckersHub<T>(endpoint: string): Promise<T | null> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }

    try {
        const url = `https://api.truckershub.in/v1/${endpoint}`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch from TruckersHub (${endpoint}):`, res.status, await res.text());
            return null;
        }

        const data: TruckersHubResponse<T> = await res.json();
        
        if (data && data.status) {
            return data.response;
        } else {
            if (Object.keys(data).length > 0 && endpoint !== 'user') { // Don't log empty error for user endpoint
                console.error(`Invalid API response structure from TruckersHub (${endpoint}):`, data);
            }
            return null;
        }
    } catch (error) {
        console.error(`Error fetching from TruckersHub (${endpoint}):`, error);
        return null;
    }
}


export async function getDashboardData() {
    try {
        const [stats, allTime, monthly, jobs, user] = await Promise.all([
            fetchTruckersHub<{ vtc: VtcStats }>('vtc'),
            fetchTruckersHub<LeaderboardUser[]>('leaderboard/alltime'),
            fetchTruckersHub<LeaderboardUser[]>('leaderboard/monthly'),
            fetchTruckersHub<Job[]>('jobs/all'),
            fetchTruckersHub<{ username: string }>('user'),
        ]);

        return { stats, allTime, monthly, jobs, user };
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return null;
    }
}
