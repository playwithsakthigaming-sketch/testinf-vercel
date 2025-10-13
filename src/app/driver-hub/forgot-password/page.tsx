
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/app/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: ForgotPasswordFormData) {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);

        toast({
            title: "Password Reset",
            description: `If an account with the email ${values.email} exists, a password reset link has been sent.`,
        });
        
        form.reset();
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
            <Image 
                src="https://media.discordapp.net/attachments/1281551151418048677/1417735782223056929/IMG_20250917_102508.jpg?ex=68edd7d6&is=68ec8656&hm=80a11804ded1c00d78e714972cbd6223a670437744541bfe3e49986c0175175b&=&format=webp&width=1194&height=722"
                alt="Background of green trucks"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
            <Card className="relative z-10 w-full max-w-md mx-4 bg-card/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Logo size={64}/>
                    </div>
                    <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </Button>
                        </form>
                    </Form>
                    
                    <div className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Button variant="link" asChild className="text-primary p-0 h-auto">
                            <Link href="/driver-hub/login">Back to Login</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
