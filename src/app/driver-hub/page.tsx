
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  Award,
  Calendar,
  ChevronRight,
  Droplets,
  Fuel,
  Map,
  ShipWheel,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DriverHubPieChart } from '@/components/app/driver-hub-pie-chart';
import { DriverHubLineChart } from '@/components/app/driver-hub-line-chart';

const upcomingEventImage =
  'https://media.discordapp.net/attachments/1281551151418048677/1417739857123475538/1758085736934.jpg?ex=68d37da2&is=68d22c22&hm=8704f60b91d953c3e9b83e28d406e362c20affcf91876b7d903227bb10d8bb9d&=&format=webp&width=1389&height=684';

export default function DriverHubPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37,905,800 kms</div>
            <p className="text-xs text-muted-foreground">Total distance driven</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Burned</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68,082,098 l</div>
            <p className="text-xs text-muted-foreground">Total fuel consumed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">61</div>
            <p className="text-xs text-muted-foreground">Jobs this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previous Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1138</div>
            <p className="text-xs text-muted-foreground">Jobs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        <div className="lg:col-span-4 space-y-4">
          <Card className="relative overflow-hidden">
            <Image
              src={upcomingEventImage}
              alt="Upcoming event banner"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <CardContent className="relative z-10 p-6 text-white flex flex-col justify-end h-64">
              <h3 className="text-lg font-semibold text-primary">
                Upcoming Event
              </h3>
              <p className="text-2xl font-bold">
                Tamil Pasanga October Convoy #61
              </p>
              <p className="text-muted-foreground text-white/80">
                Sat, 04 Oct 2025 13:00:00 GMT
              </p>
              <Button size="sm" className="mt-4 w-fit" asChild>
                <Link href="#">Details</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Celestial Milestone Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our pilots have journeyed incredible distances, pushing boundaries,
                breaking limits, and truly proving our slogan: &quot;Gateway to New
                Horizons.&quot;
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <Award className="h-6 w-6 p-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500" />
                  <ShipWheel className="h-6 w-6 p-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500" />
                  <TrendingUp className="h-6 w-6 p-1 rounded-full bg-green-500/20 text-green-400 border border-green-500" />
                  <AlertTriangle className="h-6 w-6 p-1 rounded-full bg-red-500/20 text-red-400 border border-red-500" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs by Game</CardTitle>
            </CardHeader>
            <CardContent>
              <DriverHubPieChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Jobs Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <DriverHubLineChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
