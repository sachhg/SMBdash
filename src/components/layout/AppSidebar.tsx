import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  BarChart3,
  Settings,
  Building2
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "ROI Analysis",
    href: "/roi",
    icon: TrendingUp,
  },
  {
    title: "Recommendations",
    href: "/recommendations",
    icon: Target,
  },
  {
    title: "Benchmarks",
    href: "/benchmarks",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-gradient-card border-r border-border shadow-card">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">FintelliQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-financial"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">SMB Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}