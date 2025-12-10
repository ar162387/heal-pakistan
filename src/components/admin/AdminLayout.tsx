import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const { role, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const userRole = role ?? "member";

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading admin workspace...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-muted-foreground text-sm">
            Your account is not provisioned as an admin. Please contact a super admin.
          </p>
          <Button onClick={handleLogout} variant="outline" className="mt-2">
            Back to login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar userRole={userRole} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">Content Management System</h2>
          <div className="text-right">
            <p className="text-sm font-medium">{profile?.name ?? "Admin User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole.replace("_", " ")}</p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ userRole }} />
        </main>

        <footer className="border-t border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 flex justify-end">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm text-primary/80 shadow-sm ring-1 ring-primary/15 transition-all duration-200 hover:bg-primary/15 hover:-translate-y-0.5">
            <span className="text-[11px] uppercase tracking-[0.18em]">
              Powered by
            </span>
            <a
              href="https://portfolio-olive-eta-71.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Vibe Coderz
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
