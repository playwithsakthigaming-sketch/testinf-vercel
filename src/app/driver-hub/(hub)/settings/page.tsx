
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Briefcase, Edit, Globe, Mail, MapPin, Milestone, Route, Star, Truck } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";

const countries = ["India", "USA", "Canada", "UK", "Australia", "Germany"];

const profileFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordFormSchema>;

type UserProfile = {
    username: string;
    email: string;
    avatar: string;
    country: string;
    role: string;
    steamProfile?: string;
    truckersMPProfile?: string;
}

const SteamIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M8.15,8.15C7.86,7.86 7.3,8.08 7.35,8.5L8.23,13.2L3.5,14.65C3.08,14.8 2.86,15.36 3.15,15.65L8.5,18.85L13.2,17.96L14.65,22.5C14.8,22.92 15.36,23.14 15.65,22.85L18.85,17.5L17.96,12.8L22.5,11.35C22.92,11.2 23.14,10.64 22.85,10.35L17.5,7.15L12.8,8.04L11.35,3.5C11.2,3.08 10.64,2.86 10.35,3.15L7.15,8.15M13,9A4,4 0 0,1 17,13A4,4 0 0,1 13,17A4,4 0 0,1 9,13A4,4 0 0,1 13,9M13,11A2,2 0 0,0 11,13A2,2 0 0,0 13,15A2,2 0 0,0 15,13A2,2 0 0,0 13,11Z"
      />
    </svg>
);

const userStats = [
    { label: "Total Jobs", value: 124, icon: <Truck className="text-primary"/> },
    { label: "Total Distance", value: "85,670 km", icon: <Route className="text-primary"/> },
    { label: "Longest Job", value: "2,345 km", icon: <Milestone className="text-primary"/> },
    { label: "TMP Points", value: 780, icon: <Star className="text-primary"/> },
];

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const bannerImage = PlaceHolderImages.find(p => p.id === 'hero-truck-2');


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/truckershub?endpoint=user`);
                if (!res.ok) throw new Error(`Failed to fetch user data`);
                const data = await res.json();
                if(data.response) {
                    setUserProfile({
                        ...data.response,
                        role: "Managing Director", // Placeholder
                        steamProfile: "https://steamcommunity.com/sakthi5856k", // Placeholder
                        truckersMPProfile: "https://truckersmp.com/user/4950460", // Placeholder
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: async () => {
            try {
                const res = await fetch(`/api/truckershub?endpoint=user`);
                if (!res.ok) throw new Error(`Failed to fetch user data`);
                const data = await res.json();
                if(data.response) {
                    return {
                        username: data.response.username,
                        email: data.response.email,
                        country: data.response.country || 'India',
                    }
                }
            } catch (error) {
                console.error(error);
            }
            return { username: '', email: '', country: ''}
        }
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    async function onProfileSubmit(values: ProfileFormData) {
        setIsSubmitting(true);
        // Simulate API call to save data
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    }

    async function onPasswordSubmit(values: PasswordFormData) {
        setIsSubmittingPassword(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmittingPassword(false);
        
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });

        passwordForm.reset();
    }


    return (
        <div className="p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-bold flex items-center gap-2"><Settings /> User Settings</h1>
            <Tabs defaultValue="security" className="w-full">
                <TabsList>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                </TabsList>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-lg">
                                    <FormField
                                        control={passwordForm.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CURRENT PASSWORD</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter current password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>NEW PASSWORD</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Enter new password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>RETYPE NEW PASSWORD</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Confirm your new password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSubmittingPassword}>
                                        {isSubmittingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save changes
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="connections">
                     <Card>
                        <CardHeader><CardTitle>Connections</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground">Connection settings will be available here.</p></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
