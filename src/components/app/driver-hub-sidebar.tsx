
'use client';

import { useMemo } from 'react';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    useSidebar,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Truck,
    Map,
    Award,
    Briefcase,
    Building,
    BookOpen,
    LifeBuoy,
    Newspaper,
    Star,
    ShoppingBag,
    FileQuestion,
    ChevronDown,
    Landmark,
    Warehouse,
    GanttChartSquare,
    Wallet,
    Clapperboard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const MainNav = [
    { label: 'Dashboard', href: '/driver-hub', icon: LayoutDashboard },
    { label: 'Banner', href: '/driver-hub/banner', icon: Newspaper },
    { label: 'Leaderboard', href: '/driver-hub/leaderboard', icon: Award },
    { label: 'Live Map', href: '/driver-hub/live-map', icon: Map },
    { label: 'Members', href: '/driver-hub/members', icon: Users },
];

const GameplayNav = [
    { label: 'Events', href: '/driver-hub/events', icon: Calendar },
    {
        label: 'Jobs',
        icon: Truck,
        sub: [
            { label: 'All Jobs', href: '/driver-hub/jobs/all' },
            { label: 'My Jobs', href: '/driver-hub/jobs/my' },
            { label: 'Submit Job', href: '/driver-hub/jobs/submit' },
        ],
    },
    { label: 'Tours', href: '/driver-hub/tours', icon: GanttChartSquare },
    { label: 'Division', href: '/driver-hub/division', icon: Landmark },
];

const CompanyOpsNav = [
    { label: 'Marketplace', href: '/driver-hub/marketplace', icon: Briefcase },
    { label: 'Garage HQ', href: '/driver-hub/garage-hq', icon: Warehouse },
    { label: 'Economy', href: '/driver-hub/economy', icon: Wallet },
    { label: 'Media Center', href: '/driver-hub/media-center', icon: Clapperboard },
];

const KnowledgeNav = [
    { label: 'Examination', href: '/driver-hub/examination', icon: BookOpen },
    { label: 'FAQs', href: '/driver-hub/faqs', icon: FileQuestion },
    { label: 'Resources', href: '/driver-hub/resources', icon: LifeBuoy },
];

export function DriverHubSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return pathname === href;
    };
    
    const isSubActive = (items: { label: string; href: string }[]) => {
        return items.some(item => pathname.startsWith(item.href));
    }
    
    const navSections = useMemo(() => [
        { title: "MAIN", items: MainNav },
        { title: "GAMEPLAY", items: GameplayNav },
        { title: "COMPANY OPERATIONS", items: CompanyOpsNav },
        { title: "KNOWLEDGE HUB", items: KnowledgeNav },
    ], []);

    return (
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <Logo size={32}/>
                    <span className="text-lg font-semibold">Driver Hub</span>
                 </div>
            </SidebarHeader>
            <SidebarContent className="p-0">
                {navSections.map(section => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                         <SidebarMenu>
                             {section.items.map(item => (
                                item.sub ? (
                                    <Collapsible key={item.label} defaultOpen={isSubActive(item.sub)}>
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" className="w-full justify-between pr-2 peer/menu-button flex items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <item.icon />
                                                    <span>{item.label}</span>
                                                </div>
                                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                             <SidebarMenuSub>
                                                {item.sub.map(subItem => (
                                                    <SidebarMenuSubItem key={subItem.href}>
                                                        <SidebarMenuSubButton asChild isActive={isActive(subItem.href)}>
                                                            <Link href={subItem.href}>{subItem.label}</Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                )
                             ))}
                         </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                 <Button variant="outline" className="w-full" asChild>
                    <Link href="/">Back to Website</Link>
                 </Button>
            </SidebarFooter>
        </Sidebar>
    );
}

export function DriverHubLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DriverHubSidebar />
            <main className="flex-1">
                 <header className="p-4 border-b flex items-center gap-4 md:hidden sticky top-0 bg-background z-10">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Driver Hub</h1>
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
}
