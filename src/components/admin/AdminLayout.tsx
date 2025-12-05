import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminLayout = () => {
  // For demo purposes, allow switching roles
  const [userRole, setUserRole] = useState<"super_admin" | "content_manager" | "member">("super_admin");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userRole={userRole} />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Content Management System</h2>
          
          {/* Demo role switcher - would be removed in production */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Demo Role:</span>
            <Select value={userRole} onValueChange={(value: any) => setUserRole(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="content_manager">Content Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ userRole }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
