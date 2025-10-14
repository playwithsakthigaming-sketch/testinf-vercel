
'use server';

import type { Skill, DriverSkill } from '@/lib/truckershub-types';

type ApiResponse<T> = {
    status: boolean;
    response: T;
};

async function fetchTruckersHub<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        console.error("TRUCKERSHUB_API_KEY is not set.");
        return null;
    }

    try {
        const url = `/api/truckershub?endpoint=${endpoint}`;
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Failed to fetch from TruckersHub (${endpoint}):`, res.status, await res.text());
            return null;
        }
        
        // For POST requests, the response might be different or empty on success
        if (options.method === 'POST' && res.status === 200) {
            // Check if there is a body before parsing
             const text = await res.text();
             if (text) {
                return JSON.parse(text);
             }
             return { status: true } as any;
        }

        const data: ApiResponse<T> = await res.json();
        
        if (data && data.status) {
            return data.response;
        } else {
            console.error(`Invalid API response structure from TruckersHub (${endpoint}):`, data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching from TruckersHub (${endpoint}):`, error);
        return null;
    }
}


export async function getAvailableSkills(): Promise<Skill[]> {
    const response = await fetchTruckersHub<{ skills: Skill[] }>('skills');
    return response?.skills || [];
}

export async function getDriverSkills(steamId: string): Promise<DriverSkill[] | null> {
    const response = await fetchTruckersHub<{ skills: DriverSkill[] }>(`skills/${steamId}`);
    return response?.skills || null;
}

export async function updateDriverSkills(steamId: string, skills: { id: string, level: number }[]): Promise<{ success: boolean; message?: string }> {
    const payload = skills.reduce((acc, skill) => {
        acc[skill.id] = skill.level;
        return acc;
    }, {} as Record<string, number>);

    const response = await fetchTruckersHub(`skills/${steamId}`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    
    // The API might return a success status without a body, or with a body.
    if (response) {
         return { success: true };
    }

    return { success: false, message: 'Failed to update skills. The API did not return a success status.' };
}
