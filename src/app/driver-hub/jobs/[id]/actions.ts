
'use server';

type Job = {
    id: number;
    driver: {
        id: number;
        username: string;
        avatar: string;
    };
    start_city: string;
    start_company: string;
    destination_city: string;
    destination_company: string;
    cargo: string;
    cargo_mass: number;
    distance: number;
    fuel_used: number;
    money_made: number;
    status: 'finished' | 'ongoing' | 'cancelled';
    xp: number;
    max_speed: number;
    average_speed: number;
    damage: number;
};

type ApiResponse = {
    status: boolean;
    response: Job;
};

export async function getJobDetails(jobId: string): Promise<Job | null> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }

    try {
        const url = `https://api.truckershub.in/v1/jobs/${jobId}`;
        const res = await fetch(url, {
            headers: { Authorization: apiKey },
            next: { revalidate: 300 } // Revalidate every 5 minutes
        });
        
        if (!res.ok) {
            console.error(`Failed to fetch job ${jobId}:`, res.status, await res.text());
            return null;
        }

        const data: ApiResponse = await res.json();
        
        if (data && data.status) {
            return data.response;
        } else {
            console.error(`Invalid API response structure for job ${jobId}:`, data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching job ${jobId}:`, error);
        return null;
    }
}
