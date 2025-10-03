
'use client';

import Link from 'next/link';
import {
  Home,
  Users2,
  LineChart,
  Truck,
  Settings,
  ChevronRight,
  Star,
  FileText,
  ShipWheel,
  Landmark,
  Building2,
  Newspaper,
  BookOpen,
  HelpCircle,
  Folder,
  Twitch,
  Heart,
  Store,
  UserCheck,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainNav = [
    { name: 'Dashboard', icon: Home, href: '/driver-hub' },
    { name: 'Banner', icon: Star, href: '/driver-hub/banner' },
    { name: 'Leaderboard', icon: LineChart, href: '/driver-hub/leaderboard' },
    { name: 'Live Map', icon: Map, href: '/driver-hub/map' },
    { name: 'Members', icon: Users2, href: '/driver-hub/members' },
];

const gameplayNav = [
    { name: 'Events', icon: Calendar, href: '/driver-hub/events' },
    { name: 'Jobs', icon: FileText, href: '/driver-hub/jobs' },
    { name: 'Tours', icon: ShipWheel, href: '/driver-hub/tours' },
    { name: 'Division', icon: Landmark, href: '/driver-hub/division' },
];

const companyNav = [
    { name: 'Marketplace', icon: Store, href: '/driver-hub/marketplace' },
    { name: 'Garage HQ', icon: Building2, href: '/driver-hub/garage' },
    { name: 'Economy', icon: TrendingUp, href: '/driver-hub/economy' },
    { name: 'Media Center', icon: Newspaper, href: '/driver-hub/media' },
];

const knowledgeNav = [
    { name: 'Examination', icon: BookOpen, href: '/driver-hub/examination' },
    { name: 'FAQs', icon: HelpCircle, href: '/driver-hub/faq' },
    { name: 'Resources', icon: Folder, href: '/driver-hub/resources' },
];

const supportNav = [
    { name: 'Streamer Program', icon: Twitch, href: '/driver-hub/streamers' },
    { name: 'Patreons', icon: Heart, href: '/driver-hub/patreons' },
    { name: 'Shop', icon: Store, href: '/driver-hub/shop' },
    { name: 'Human Resources', icon: UserCheck, href: '/driver-hub/hr' },
];


const NavSection = ({ title, items }: { title: string; items: typeof mainNav }) => {
    const pathname = usePathname();
    return (
        <div className="px-2">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">{title}</h3>
            {items.map((item) => (
                <TooltipProvider key={item.name}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <Button
                            variant={pathname === item.href ? 'secondary' : 'ghost'}
                            className="w-full justify-start gap-2"
                            asChild
                        >
                            <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span className="truncate">{item.name}</span>
                            </Link>
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.name}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
};


export function DriverHubSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-card sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
        >
          <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="truncate">Tamil Pasanga</span>
        </Link>
      </nav>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start text-sm font-medium space-y-4">
            <NavSection title="Main" items={mainNav} />
            <NavSection title="Gameplay" items={gameplayNav} />
            <NavSection title="Company Operations" items={companyNav} />
            <NavSection title="Knowledge Hub" items={knowledgeNav} />
            <NavSection title="Support" items={supportNav} />
        </nav>
      </div>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
