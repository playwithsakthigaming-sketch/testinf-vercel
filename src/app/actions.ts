
'use server';

import { applicationSchema, type ApplicationData } from '@/lib/schemas';
import fs from 'fs/promises';
import path from 'path';
import type { Application, ApplicationsData } from '@/lib/applications';
import { revalidatePath } from 'next/cache';

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

async function writeApplications(data: ApplicationsData): Promise<void> {
    await fs.writeFile(applicationsFilePath, JSON.stringify(data, null, 2));
}

export type SubmitResult = {
    success: boolean;
    message: string;
    applicationId?: string;
    errors?: Record<string, string[] | undefined>;
}

function generateApplicationId() {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `TP-${randomNumber}`;
}

export async function submitApplication(data: ApplicationData): Promise<SubmitResult> {
    const validation = applicationSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            message: 'Invalid form data.',
            errors: validation.error.flatten().fieldErrors,
        };
    }

    const applicationId = generateApplicationId();
    const { username, email, truckersmp, truckershub } = validation.data;

    const newApplication: Application = {
        id: applicationId,
        name: username,
        discordTag: '', // Not in the new form
        email: email,
        steamUrl: '', // Not in the new form
        truckersmpUrl: truckersmp,
        truckershubUrl: truckershub,
        experience: 'fresher', // Default value
        howYouFound: 'others', // Default value
        status: 'Pending',
        submittedAt: new Date().toISOString(),
    };

    try {
        const applicationsData = await readApplications();
        applicationsData.applications.unshift(newApplication);
        await writeApplications(applicationsData);
        revalidatePath('/admin/applications');
    } catch (error) {
        console.error('Error saving application:', error);
        return { success: false, message: 'Server error: Could not save application.' };
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    

    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set in .env file');
        return { success: false, message: 'Server configuration error.' };
    }


    const fields = [
        { name: 'Username', value: username, inline: true },
        { name: 'Email', value: email, inline: true },
        { name: 'TruckersMP', value: truckersmp || 'Not Provided', inline: false },
        { name: 'TruckersHub', value: truckershub || 'Not Provided', inline: false },
    ];

    const embed = {
        title: `New VTC Registration - ${applicationId}`,
        color: 3977201, // Medium Sea Green
        fields: fields,
        timestamp: new Date().toISOString(),
        footer: {
            text: 'Tamil Pasanga VTC Registration',
        },
    };
    
    const payload = {
        content: `New registration from ${username}`,
        embeds: [embed],
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 2, // Button
                style: 3, // Success
                label: 'Accept',
                custom_id: `accept_${applicationId}`,
              },
              {
                type: 2, // Button
                style: 4, // Danger
                label: 'Reject',
                custom_id: `reject_${applicationId}`,
              },
              {
                type: 2, // Button
                style: 1, // Primary
                label: 'Accept for Interview',
                custom_id: `interview_${applicationId}`,
              },
            ],
          },
        ],
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Discord webhook failed with status: ${response.status}`);
            const errorBody = await response.text();
            console.error('Error body:', errorBody);
            // Don't fail the whole process if webhook fails, application is saved.
        }

        return { success: true, message: 'Application submitted successfully!', applicationId };
    } catch (error) {
        console.error('Error submitting application to Discord:', error);
        // Don't fail the whole process if webhook fails, application is saved.
        return { success: true, message: 'Application submitted successfully!', applicationId };
    }
}

export type ApplicationStatusResult = {
    applicationId: string;
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Interview' | 'Not Found';
};

export async function getApplicationStatus(
  applicationId: string
): Promise<ApplicationStatusResult> {
    const validIdRegex = /^TP-\d{4}$/;
    if (!validIdRegex.test(applicationId)) {
        return { applicationId, status: 'Not Found' };
    }

    try {
        const applicationsData = await readApplications();
        const application = applicationsData.applications.find(app => app.id === applicationId);

        if (application) {
            return { applicationId, status: application.status };
        } else {
            return { applicationId, status: 'Not Found' };
        }
    } catch (error) {
        console.error('Error reading application status:', error);
        return { applicationId, status: 'Not Found' }; // Treat file read errors as "Not Found" for the user
    }
}
