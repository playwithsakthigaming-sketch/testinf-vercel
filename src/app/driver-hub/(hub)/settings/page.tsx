
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";


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
}

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: '',
            email: '',
            country: '',
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`/api/truckershub?endpoint=user`);
                if (!res.ok) throw new Error(`Failed to fetch user data`);
                const data = await res.json();
                if(data.response) {
                    setUserProfile(data.response);
                    // Set form values once data is fetched
                    profileForm.setValue('username', data.response.username || '');
                    profileForm.setValue('email', data.response.email || '');
                    profileForm.setValue('country', data.response.country || 'India');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, [profileForm]);

    async function onProfileSubmit(values: ProfileFormData) {
        setIsSubmittingProfile(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmittingProfile(false);
        
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    }

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

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
            <h1 className="text-3xl font-bold flex items-center gap-2"><User /> User Settings</h1>
            <Tabs defaultValue="profile" className="w-full">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={userProfile?.avatar} alt={userProfile?.username} />
                                            <AvatarFallback>{userProfile?.username?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Button>Upload</Button>
                                                <Button variant="ghost">Reset</Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Allowed JPG, GIF or PNG. Max size of 2MB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={profileForm.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={profileForm.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a country" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {countries.map(country => (
                                                                <SelectItem key={country} value={country}>{country}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Button type="submit" disabled={isSubmittingProfile}>
                                            {isSubmittingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save changes
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your password here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
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
