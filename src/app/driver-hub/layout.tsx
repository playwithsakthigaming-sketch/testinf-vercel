
import { DriverHubHeader } from "@/components/app/driver-hub-header";
import { DriverHubSidebar } from "@/components/app/driver-hub-sidebar";

export default function DriverHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DriverHubSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <DriverHubHeader />
            <main>{children}</main>
        </div>
    </div>
  );
}
