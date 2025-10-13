
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";

const countries = ["India", "USA", "Canada", "UK", "Australia", "Germany"];

export default function SettingsPage() {
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
                             <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="SAKTHIVEL" />
                                    <AvatarFallback>S</AvatarFallback>
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
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" defaultValue="SAKTHIVEL" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="lsk27102@gmail.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                     <Select defaultValue="India">
                                        <SelectTrigger id="country">
                                            <SelectValue placeholder="Select a country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map(country => (
                                                <SelectItem key={country} value={country}>{country}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div>
                                <Button>Save changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground">Security settings will be available here.</p></CardContent>
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
