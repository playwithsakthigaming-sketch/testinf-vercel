
import { z } from 'zod';

export const applicationSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    truckersmp: z.string().url('Invalid TruckersMP profile URL.').optional().or(z.literal('')),
    truckershub: z.string().url('Invalid TruckersHub profile URL.').optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    terms: z.literal<boolean>(true, {
        errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
