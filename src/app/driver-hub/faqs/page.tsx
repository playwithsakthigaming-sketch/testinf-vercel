
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
    return (
        <div className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>FAQs</CardTitle>
                    <CardDescription>This page is under construction. Check back soon for updates!</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This page will contain Frequently Asked Questions.</p>
                </CardContent>
            </Card>
        </div>
    );
}
