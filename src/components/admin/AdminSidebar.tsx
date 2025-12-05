import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserCog,
  MessageSquareQuote,
  UserPlus,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin", roles: ["super_admin", "content_manager", "member"] },
  { title: "Alumni", icon: GraduationCap, path: "/admin/alumni", roles: ["super_admin", "content_manager"] },
  { title: "Events", icon: Calendar, path: "/admin/events", roles: ["super_admin", "content_manager"] },
  { title: "Publications", icon: FileText, path: "/admin/publications", roles: ["super_admin", "content_manager"] },
  { title: "Team", icon: UserCog, path: "/admin/team", roles: ["super_admin", "content_manager"] },
  { title: "Testimonials", icon: MessageSquareQuote, path: "/admin/testimonials", roles: ["super_admin", "content_manager"] },
  { title: "Membership", icon: UserPlus, path: "/admin/membership", roles: ["super_admin"] },
  { title: "Users", icon: Users, path: "/admin/users", roles: ["super_admin"] },
  { title: "Settings", icon: Settings, path: "/admin/settings", roles: ["super_admin"] },
];

interface AdminSidebarProps {
  userRole: "super_admin" | "content_manager" | "member";
}

const AdminSidebar = ({ userRole }: AdminSidebarProps) => {
  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary">HEAL Pakistan</h1>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">HA</span>
          </div>
          <div>
            <p className="text-sm font-medium">Habib ur Rehman</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole.replace("_", " ")}</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-2 w-full text-sm text-muted-foreground hover:text-destructive transition-colors">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
