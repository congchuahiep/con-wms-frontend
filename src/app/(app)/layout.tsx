import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MapProvider } from "@/providers/map-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <MapProvider>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          {children}
        </SidebarInset>
      </MapProvider>
    </SidebarProvider>
  );
}
