
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return new NextResponse('Missing endpoint parameter', { status: 400 });
    }

    const apiKey = process.env.TRUCKERSHUB_API_KEY;
    if (!apiKey) {
        return new NextResponse('API key is not configured on the server', { status: 500 });
    }

    // Rebuild the query string for the API call, excluding the 'endpoint' param
    const apiParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (key !== 'endpoint') {
            apiParams.append(key, value);
        }
    });

    const queryString = apiParams.toString();
    const truckersHubUrl = `https://api.truckershub.in/v1/${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    try {
        const apiResponse = await fetch(truckersHubUrl, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json',
            },
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.text();
            console.error(`TruckersHub API error: ${apiResponse.status} ${errorBody}`);
            return new NextResponse(`Error from TruckersHub API: ${apiResponse.statusText}`, { status: apiResponse.status });
        }

        const data = await apiResponse.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Failed to fetch from TruckersHub API:', error);
        return new NextResponse('Failed to fetch from TruckersHub API', { status: 500 });
    }
}
