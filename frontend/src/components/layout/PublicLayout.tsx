import { Link, useLocation } from "wouter";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${location === path ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Mortality Surveillance System" className="h-10 w-auto object-contain" />
            <span className="text-lg font-semibold">Mortality Surveillance</span>
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
            <Link href="/login" className={navLinkClass("/login")}>
              Login
            </Link>
            <Link href="/register" className={navLinkClass("/register")}>
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
