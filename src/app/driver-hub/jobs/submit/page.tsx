
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const jobSchema = z.object({
    game: z.string().min(1),
    from: z.string().min(1, 'Departure location is required'),
    to: z.string().min(1, 'Destination location is required'),
    cargo: z.string().min(1, 'Cargo type is required'),
    distance: z.coerce.number().min(1, 'Distance is required'),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function SubmitJobPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            game: 'ETS2',
            from: '',
            to: '',
            cargo: '',
        }
    });

    async function onSubmit(data: JobFormData) {
        setIsSubmitting(true);
        // Here you would typically send the data to your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);

        toast({
            title: 'Job Submitted',
            description: 'Your job has been successfully submitted.',
        });
        
        router.push('/driver-hub/jobs/my');
    }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a Job</CardTitle>
          <CardDescription>
            Fill out the form below to log a completed job.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="game"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Game</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a game" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="ETS2">Euro Truck Simulator 2</SelectItem>
                                    <SelectItem value="ATS">American Truck Simulator</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="cargo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Cargo</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Medical Equipment" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="from"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>From</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Prague" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="to"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>To</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Duisburg" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Distance (km)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 910" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Job
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
