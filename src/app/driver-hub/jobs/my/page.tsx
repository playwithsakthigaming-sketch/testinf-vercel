
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyJobsPage() {
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Jobs</CardTitle>
                    <CardDescription>This page is under construction. Check back soon for updates!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Here you will be able to see a list of all jobs you have personally submitted.</p>
                </CardContent>
            </Card>
        </div>
    );
}
