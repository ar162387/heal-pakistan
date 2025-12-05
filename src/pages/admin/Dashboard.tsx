import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, FileText, Users, UserPlus, MessageSquareQuote } from "lucide-react";

const stats = [
  { title: "Total Alumni", value: "156", icon: GraduationCap, change: "+12 this month" },
  { title: "Active Events", value: "8", icon: Calendar, change: "3 upcoming" },
  { title: "Publications", value: "42", icon: FileText, change: "+5 this month" },
  { title: "Team Members", value: "24", icon: Users, change: "8 cabinet members" },
  { title: "Testimonials", value: "18", icon: MessageSquareQuote, change: "+3 this month" },
  { title: "Membership Applications", value: "34", icon: UserPlus, change: "12 pending" },
];

const recentActivity = [
  { action: "New alumni added", user: "Vaneeza Khan", time: "2 hours ago" },
  { action: "Event published", user: "Admin", time: "5 hours ago" },
  { action: "Blog post updated", user: "Content Manager", time: "1 day ago" },
  { action: "New member application", user: "System", time: "1 day ago" },
  { action: "Team member updated", user: "Admin", time: "2 days ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HEAL Pakistan Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left">
              <GraduationCap className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Add Alumni</p>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left">
              <Calendar className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Create Event</p>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left">
              <FileText className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">New Publication</p>
            </button>
            <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left">
              <Users className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Manage Team</p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
