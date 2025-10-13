
'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import type { ApplicationsData } from '@/lib/applications';

const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');

async function readApplications(): Promise<ApplicationsData> {
    try {
        const data = await fs.readFile(applicationsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { applications: [] };
        }
        throw error;
    }
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type LoginResult = {
    success: boolean;
    message: string;
};

export async function loginAction(data: LoginFormData): Promise<LoginResult> {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { email } = validation.data;

    try {
        const applicationsData = await readApplications();
        const application = applicationsData.applications.find(app => app.email.toLowerCase() === email.toLowerCase());

        if (!application) {
            return { success: false, message: 'No application found for this email.' };
        }

        if (application.status === 'Accepted') {
            return { success: true, message: 'Login successful!' };
        }
        
        if (application.status === 'Rejected') {
            return { success: false, message: 'Your application has been rejected. Please contact support for more information.' };
        }
        
        if (application.status === 'Pending') {
            return { success: false, message: 'Your application is still pending review. Please check back later.' };
        }

        return { success: false, message: 'You do not have permission to log in.' };

    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'An internal server error occurred.' };
    }
}
