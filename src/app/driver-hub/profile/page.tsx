
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Briefcase, Edit, Globe, Mail, MapPin, Milestone, Route, Star, Truck } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

const user = {
    name: "POWERFUL GAMING",
    role: "Managing Director",
    avatar: "https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826",
    email: "powerful@gaming.com",
    country: "India",
    steamProfile: "https://steamcommunity.com/sakthi5856k",
    truckersMPProfile: "https://truckersmp.com/user/4950460",
    stats: [
        { label: "Total Jobs", value: 124, icon: <Truck className="text-primary"/> },
        { label: "Total Distance", value: "85,670 km", icon: <Route className="text-primary"/> },
        { label: "Longest Job", value: "2,345 km", icon: <Milestone className="text-primary"/> },
        { label: "TMP Points", value: 780, icon: <Star className="text-primary"/> },
    ]
};

const SteamIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M8.15,8.15C7.86,7.86 7.3,8.08 7.35,8.5L8.23,13.2L3.5,14.65C3.08,14.8 2.86,15.36 3.15,15.65L8.5,18.85L13.2,17.96L14.65,22.5C14.8,22.92 15.36,23.14 15.65,22.85L18.85,17.5L17.96,12.8L22.5,11.35C22.92,11.2 23.14,10.64 22.85,10.35L17.5,7.15L12.8,8.04L11.35,3.5C11.2,3.08 10.64,2.86 10.35,3.15L7.15,8.15M13,9A4,4 0 0,1 17,13A4,4 0 0,1 13,17A4,4 0 0,1 9,13A4,4 0 0,1 13,9M13,11A2,2 0 0,0 11,13A2,2 0 0,0 13,15A2,2 0 0,0 15,13A2,2 0 0,0 13,11Z"
      />
    </svg>
);


export default function ProfilePage() {
    const bannerImage = PlaceHolderImages.find(p => p.id === 'hero-truck-2');
    
    return (
        <div className="p-4 md:p-8 space-y-8">
            <Card className="overflow-hidden">
                <div className="relative h-48 bg-card">
                   {bannerImage && <Image src={bannerImage.imageUrl} alt="Profile Banner" fill className="object-cover"/>}
                   <div className="absolute inset-0 bg-black/50"/>
                </div>
                <CardContent className="p-6 pt-0">
                    <div className="flex items-end -mt-16">
                        <Avatar className="h-32 w-32 border-4 border-card">
                            <AvatarImage src={user.avatar} alt={user.name}/>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-grow">
                             <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
                             <p className="text-muted-foreground">{user.role}</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/driver-hub/settings">
                                <Edit className="mr-2 h-4 w-4"/>Edit Profile
                            </Link>
                        </Button>
                    </div>

                    <Separator className="my-6"/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Contact Information</h3>
                             <div className="flex items-center gap-3 text-sm">
                                <Mail className="text-muted-foreground"/>
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="text-muted-foreground"/>
                                <span>{user.country}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Online Profiles</h3>
                            <div className="flex items-center gap-3 text-sm">
                                <SteamIcon />
                                <a href={user.steamProfile} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                    Steam Profile
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="text-muted-foreground"/>
                                 <a href={user.truckersMPProfile} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                    TruckersMP Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {user.stats.map(stat => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of your recent jobs and company activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No recent activity to display.</p>
                </CardContent>
            </Card>
        </div>
    );
}
