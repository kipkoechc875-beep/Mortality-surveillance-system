import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useRecords } from "@/context/RecordsContext";
import { LayoutDashboard, PlusCircle, FileText, ShieldCheck, LogOut, MapPin } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { unreadCount } = useRecords();
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
                          <span>User Management</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  {user?.role === "admin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location === "/locations"}>
                        <Link href="/locations" data-testid="link-locations">
                          <MapPin />
                          <span>Hospital Locations</span>
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
                      <Link href="/records" data-testid="link-records" className="flex items-center gap-2">
                        <FileText />
                        <span>Records / Reports</span>
                        {user?.role === "admin" && unreadCount > 0 ? (
                          <Badge className="ml-2">{unreadCount}</Badge>
                        ) : null}
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
            <nav className="ml-4 flex items-center gap-4">
              <Link href="/dashboard" className={location === "/dashboard" ? "text-foreground text-sm font-medium flex items-center gap-2" : "text-muted-foreground hover:text-foreground text-sm font-medium flex items-center gap-2"}>
                <LayoutDashboard />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link href="/" className={location === "/" ? "text-foreground text-sm font-medium" : "text-muted-foreground hover:text-foreground text-sm font-medium"}>
                Home
              </Link>
              <Link href="/about" className={location === "/about" ? "text-foreground text-sm font-medium" : "text-muted-foreground hover:text-foreground text-sm font-medium"}>
                About
              </Link>
              <Link href="/contact" className={location === "/contact" ? "text-foreground text-sm font-medium" : "text-muted-foreground hover:text-foreground text-sm font-medium"}>
                Contact
              </Link>
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden sm:block text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{user?.username}</span></div>
              <Button variant="ghost" onClick={() => { logout(); setLocation("/login"); }}>
                Logout
              </Button>
            </div>
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
