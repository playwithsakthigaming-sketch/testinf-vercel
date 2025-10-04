
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { EventsData, Event } from '@/lib/events';

const eventsFilePath = path.join(process.cwd(), 'src', 'lib', 'events.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { events: [] } as any;
        }
        throw error;
    }
}

export async function getEvents(): Promise<Event[]> {
    const data = await readJsonFile<EventsData>(eventsFilePath);
    return data.events;
}
