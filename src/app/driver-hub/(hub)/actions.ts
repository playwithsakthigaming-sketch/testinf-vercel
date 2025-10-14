
'use server';

import type { VtcStats, LeaderboardUser, Job } from '@/lib/truckershub-types';

type TruckersHubResponse<T> = {
    status: boolean;
    response: T;
};

async function fetchTruckersHubAPI<T>(endpoint: string): Promise<T | null> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }
    
    // This function will be called from a server component, so we can fetch directly.
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
             // Don't log an error for an empty object response, which can be valid for some endpoints
            if (typeof data.response === 'object' && data.response !== null && Object.keys(data.response).length > 0) {
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
            fetchTruckersHubAPI<{ vtc: VtcStats }>('vtc'),
            fetchTruckersHubAPI<LeaderboardUser[]>('leaderboard/alltime'),
            fetchTruckersHubAPI<LeaderboardUser[]>('leaderboard/monthly'),
            fetchTruckersHubAPI<Job[]>('jobs/all'),
            fetchTruckersHubAPI<{ username: string }>('user'),
        ]);
        
        return { stats, allTime, monthly, jobs, user };
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return { stats: null, allTime: null, monthly: null, jobs: null, user: null };
    }
}
