import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, PlusCircle, FileText, ShieldCheck, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarContent>
            <div className="p-4 flex items-center border-b border-border">
              <img src="/logo.png" alt="Mortality Surveillance System" className="h-12 w-auto object-contain" />
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/dashboard"}>
                      <Link href="/dashboard" data-testid="link-dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {user?.role === "admin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/admin"}>
                        <Link href="/admin" data-testid="link-admin">
                          <ShieldCheck />
                          <span>Admin Panel</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/records/new"}>
                      <Link href="/records/new" data-testid="link-add-record">
                        <PlusCircle />
                        <span>Add Record</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location === "/records"}>
                      <Link href="/records" data-testid="link-records">
                        <FileText />
                        <span>Records / Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-border">
            <div className="mb-4 px-2 text-sm text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user?.username}</span>
            </div>
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 sticky top-0 z-10">
            <SidebarTrigger />
            <img src="/logo.png" alt="Mortality Surveillance System" className="h-8 w-auto object-contain" />
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
