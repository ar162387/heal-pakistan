import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useAuth } from "@/context/AuthContext";

const primaryNavItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "Events", path: "/events" },
  { name: "Join Us", path: "/join" },
  { name: "Contact", path: "/contact" },
];

const secondaryNavItems = [
  { name: "Alumni", path: "/alumni" },
  { name: "Publications", path: "/publications" },
  { name: "Collaborators", path: "/collaborators" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Team", path: "/team" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { session, profile } = useAuth();

  const siteName = settings?.site_name || "HEAL Pakistan";
  const slogan = settings?.slogan || "Reach the Unreached";
  const accountLabel = profile?.email ?? session?.user?.email ?? "Dashboard";

  const handleMoreEnter = () => {
    if (moreCloseTimeout.current) clearTimeout(moreCloseTimeout.current);
    setIsMoreOpen(true);
  };

  const handleMoreLeave = () => {
    if (moreCloseTimeout.current) clearTimeout(moreCloseTimeout.current);
    moreCloseTimeout.current = setTimeout(() => setIsMoreOpen(false), 180);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={siteName} className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full bg-muted" />
            ) : (
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg lg:text-xl">
                  {siteName?.[0]?.toUpperCase() ?? "H"}
                </span>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-foreground text-lg lg:text-xl">{siteName}</h1>
              <p className="text-xs text-muted-foreground">{slogan}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {primaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.path
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="relative" onMouseEnter={handleMoreEnter} onMouseLeave={handleMoreLeave}>
              <button
                className="px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-expanded={isMoreOpen}
                onClick={() => setIsMoreOpen((prev) => !prev)}
              >
                More
              </button>
              <div
                className={cn(
                  "absolute left-0 top-full pt-2 transition duration-150",
                  isMoreOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
                )}
                onMouseEnter={handleMoreEnter}
                onMouseLeave={handleMoreLeave}
              >
                <div className="w-48 rounded-md border border-border bg-card shadow-lg overflow-hidden">
                  <div className="py-2">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMoreOpen(false)}
                        className={cn(
                          "block px-4 py-2 text-sm transition-colors",
                          location.pathname === item.path
                            ? "text-primary bg-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {session ? (
              <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2">
                <Link to="/admin">
                  <User className="h-4 w-4" />
                  {accountLabel}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="hidden md:flex gap-2">
                <Link to="/admin/login">
                  <User className="h-4 w-4" />
                  Member Login
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="xl:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    location.pathname === item.path
                      ? "text-primary bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">More</p>
                {secondaryNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                      location.pathname === item.path
                        ? "text-primary bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 px-4 pt-4 mt-2 border-t border-border">
                <Button asChild variant="outline" size="sm" className="flex-1 gap-2">
                  <Link to={session ? "/admin" : "/admin/login"} onClick={() => setIsOpen(false)}>
                    <User className="h-4 w-4" />
                    {session ? accountLabel : "Member Login"}
                  </Link>
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
