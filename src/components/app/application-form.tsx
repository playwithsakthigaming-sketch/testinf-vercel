
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { submitApplication, type SubmitResult } from '@/app/actions';
import { type ApplicationData, applicationSchema } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';

export function ApplicationForm({ onFormSubmit }: { onFormSubmit?: () => void }) {
  const [isTermsRead, setIsTermsRead] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmitResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (submissionResult?.success && submissionResult.applicationId) {
      const timer = setTimeout(() => {
        setSubmissionResult(null);
        if (onFormSubmit) {
          onFormSubmit();
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [submissionResult, onFormSubmit]);

  const form = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      username: '',
      email: '',
      truckersmp: '',
      truckershub: '',
      password: '',
      terms: false,
    },
  });

  async function onSubmit(data: ApplicationData) {
    setIsSubmitting(true);
    const result = await submitApplication(data);
    setIsSubmitting(false);

    if (result.success) {
      setSubmissionResult(result);
      form.reset();
      setIsTermsRead(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'An error occurred',
      });
    }
  }

  if (submissionResult?.success) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-primary">Registration Complete!</h2>
        <p className="text-muted-foreground mt-2">Thank you for registering.</p>
        <p className="mt-4">Your Application ID is:</p>
        <p className="text-3xl font-bold text-primary mt-2">{submissionResult.applicationId}</p>
        <p className="text-sm text-muted-foreground mt-4">Your application is under review. You can close this window.</p>
      </div>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="truckersmp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TruckersMP Profile URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://truckersmp.com/user/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="truckershub"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TruckersHub Profile URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://truckershub.in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isTermsRead || isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the terms and conditions.
                  </FormLabel>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={() => setIsTermsModalOpen(true)}
                  >
                    Click here to read the terms.
                  </Button>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</> : 'Register'}
          </Button>
        </form>
      </Form>

      <AlertDialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-left max-h-[60vh] overflow-y-auto pr-2">
                  <p className="mb-4">Welcome to Tamil Pasanga VTC. By submitting this application, you agree to the following terms and conditions:</p>
                  <ol className="list-decimal list-inside space-y-2">
                      <li>You must be at least 15 years of age to apply.</li>
                      <li>You must own a legal copy of Euro Truck Simulator 2 or American Truck Simulator on Steam.</li>
                      <li>You must have a registered TruckersMP account in good standing.</li>
                      <li>Respect all members of the community, including staff and fellow drivers. Harassment, discrimination, or any form of abuse will not be tolerated.</li>
                      <li>Follow all TruckersMP rules and regulations during convoys and on public servers.</li>
                      <li>Maintain a professional and realistic driving standard. Reckless driving is not permitted.</li>
                      <li>You are required to log a minimum number of jobs/miles per month as specified in our driver handbook to remain an active driver.</li>
                      <li>Communication is key. You must join our Discord server and be responsive to official announcements.</li>
                      <li>Dual VTCing (being a member of another VTC) is permitted, but your commitment to Tamil Pasanga must be maintained.</li>
                      <li>Failure to comply with these rules may result in disciplinary action, including suspension or removal from the VTC.</li>
                  </ol>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsTermsRead(true);
                setIsTermsModalOpen(false);
              }}
            >
              I have read and agree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
