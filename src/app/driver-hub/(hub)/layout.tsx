
import { DriverHubSidebar, DriverHubLayoutContent } from '@/components/app/driver-hub-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DriverHubLayoutContent>
        {children}
    </DriverHubLayoutContent>
  );
}
