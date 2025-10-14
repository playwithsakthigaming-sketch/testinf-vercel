
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, Star, Wrench } from 'lucide-react';
import { getDriverSkills, updateDriverSkills, getAvailableSkills } from './actions';
import { useToast } from '@/hooks/use-toast';
import type { Skill, DriverSkill } from '@/lib/truckershub-types';

const skillUpdateSchema = z.object({
    steamId: z.string().min(1, 'Steam ID is required'),
    skills: z.array(z.object({
        id: z.string(),
        name: z.string(),
        level: z.coerce.number().min(0).max(6)
    }))
});

type SkillUpdateFormData = z.infer<typeof skillUpdateSchema>;

const StarRating = ({ level, onSetLevel, maxLevel }: { level: number, onSetLevel: (level: number) => void, maxLevel: number }) => (
    <div className="flex gap-1">
        {Array.from({ length: maxLevel }).map((_, i) => (
            <Star
                key={i}
                className={`cursor-pointer h-5 w-5 ${i < level ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                onClick={() => onSetLevel(i + 1)}
            />
        ))}
    </div>
);

export default function SkillsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchedSteamId, setSearchedSteamId] = useState<string | null>(null);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const { toast } = useToast();

    const form = useForm<SkillUpdateFormData>({
        resolver: zodResolver(skillUpdateSchema),
        defaultValues: {
            steamId: '',
            skills: []
        }
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "skills"
    });

    useEffect(() => {
        const fetchAvailableSkills = async () => {
            const skills = await getAvailableSkills();
            setAvailableSkills(skills);
        };
        fetchAvailableSkills();
    }, []);

    const handleSearch = async () => {
        const steamId = form.getValues('steamId');
        if (!steamId) {
            form.setError('steamId', { message: 'Please enter a Steam ID.' });
            return;
        }

        setIsLoading(true);
        setSearchedSteamId(steamId);
        const driverSkills = await getDriverSkills(steamId);
        
        if (driverSkills && availableSkills.length > 0) {
            const skillsWithLevels = availableSkills.map(availSkill => {
                const driverSkill = driverSkills.find(ds => ds.id === availSkill.id);
                return {
                    id: availSkill.id,
                    name: availSkill.name,
                    level: driverSkill ? driverSkill.level : 0,
                };
            });
            replace(skillsWithLevels);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Could not fetch skills for Steam ID: ${steamId}`,
            });
            replace([]);
        }
        setIsLoading(false);
    };
    
    const onSubmit = async (data: SkillUpdateFormData) => {
        setIsSubmitting(true);
        const result = await updateDriverSkills(data.steamId, data.skills);
        if (result.success) {
            toast({
                title: 'Success',
                description: "Driver skills have been updated.",
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message || 'Failed to update skills.',
            });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2"><Wrench />Driver Skills</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Driver Skills</CardTitle>
                    <CardDescription>Look up a driver by their SteamID64 to view or update their skills.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <FormField
                                    control={form.control}
                                    name="steamId"
                                    render={({ field }) => (
                                        <FormItem className="flex-grow">
                                            <FormLabel>SteamID64</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter driver's SteamID64" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" onClick={handleSearch} disabled={isLoading} className="self-end">
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                                    Search
                                </Button>
                            </div>
                            
                            {fields.length > 0 && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="text-lg font-medium">Skills for {searchedSteamId}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {fields.map((field, index) => {
                                            const skillInfo = availableSkills.find(s => s.id === field.id);
                                            return (
                                                <FormField
                                                    key={field.id}
                                                    control={form.control}
                                                    name={`skills.${index}.level`}
                                                    render={({ field: levelField }) => (
                                                        <FormItem>
                                                            <FormLabel>{field.name}</FormLabel>
                                                            <FormControl>
                                                                <StarRating
                                                                    level={levelField.value}
                                                                    onSetLevel={(level) => levelField.onChange(level)}
                                                                    maxLevel={skillInfo?.max_level || 6}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            );
                                        })}
                                    </div>
                                     <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Update Skills
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
