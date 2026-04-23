import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${location === path ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Web-Based Mortality Surveillance System" className="h-10 w-auto object-contain" />
            <span className="text-lg font-semibold">Web-Based Mortality Surveillance System</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/about" className={navLinkClass("/about")}>
              About
            </Link>
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
            {!isAuthenticated ? (
              <>
                <Link href="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link href="/register" className={navLinkClass("/register")}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground p-1 rounded">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-sm">
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
