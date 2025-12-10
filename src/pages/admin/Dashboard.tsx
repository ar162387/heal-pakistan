import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, FileText, Users, UserPlus, MessageSquareQuote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentActivity } from "@/api/activity";
import { listAlumni } from "@/api/alumni";
import { listEvents } from "@/api/events";
import { listPublications } from "@/api/publications";
import { listTeamMembers } from "@/api/team";
import { listTestimonials } from "@/api/testimonials";
import { listMembershipApplications } from "@/api/membership";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: alumni, isLoading: alumniLoading } = useQuery({
    queryKey: ["dashboard", "alumni-count"],
    queryFn: () => listAlumni(),
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["dashboard", "events-count"],
    queryFn: () => listEvents(),
  });

  const { data: publications, isLoading: publicationsLoading } = useQuery({
    queryKey: ["dashboard", "publications-count"],
    queryFn: () => listPublications(),
  });

  const { data: teamMembers, isLoading: teamLoading } = useQuery({
    queryKey: ["dashboard", "team-count"],
    queryFn: () => listTeamMembers({}),
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["dashboard", "testimonials-count"],
    queryFn: () => listTestimonials({}),
  });

  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["dashboard", "membership-count"],
    queryFn: () => listMembershipApplications({}),
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["recent-activity", "dashboard"],
    queryFn: () => fetchRecentActivity(5),
  });

  const pendingMemberships = useMemo(
    () => (memberships ?? []).filter((m) => m.status === "pending").length,
    [memberships]
  );

  const publishedEvents = useMemo(
    () => (events ?? []).filter((e) => e.is_published).length,
    [events]
  );

  const stats = [
    {
      title: "Total Alumni",
      value: alumniLoading ? "…" : (alumni?.length ?? 0),
      icon: GraduationCap,
      change: "",
      to: "/admin/alumni",
    },
    {
      title: "Active Events",
      value: eventsLoading ? "…" : publishedEvents,
      icon: Calendar,
      change: eventsLoading ? "" : `${events?.length ?? 0} total`,
      to: "/admin/events",
    },
    {
      title: "Publications",
      value: publicationsLoading ? "…" : (publications?.length ?? 0),
      icon: FileText,
      change: "",
      to: "/admin/publications",
    },
    {
      title: "Team Members",
      value: teamLoading ? "…" : (teamMembers?.length ?? 0),
      icon: Users,
      change: "",
      to: "/admin/team",
    },
    {
      title: "Testimonials",
      value: testimonialsLoading ? "…" : (testimonials?.length ?? 0),
      icon: MessageSquareQuote,
      change: "",
      to: "/admin/testimonials",
    },
    {
      title: "Membership Applications",
      value: membershipsLoading ? "…" : (memberships?.length ?? 0),
      icon: UserPlus,
      change: membershipsLoading ? "" : `${pendingMemberships} pending`,
      to: "/admin/membership",
    },
  ];

  const quickActions = [
    { label: "Add Alumni", icon: GraduationCap, to: "/admin/alumni" },
    { label: "Create Event", icon: Calendar, to: "/admin/events" },
    { label: "New Publication", icon: FileText, to: "/admin/publications" },
    { label: "Manage Team", icon: Users, to: "/admin/team" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to HEAL Pakistan Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => navigate(stat.to)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change && <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>}
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
            {activityLoading && <p className="text-sm text-muted-foreground">Loading activity...</p>}
            {!activityLoading && (!recentActivity || recentActivity.length === 0) && (
              <p className="text-sm text-muted-foreground">No recent activity yet.</p>
            )}
            {!activityLoading && recentActivity && (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {activity.action} on {activity.entity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.actor?.name ?? "System"} ({activity.actor?.role ?? "unknown"})
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                onClick={() => navigate(action.to)}
              >
                <action.icon className="h-5 w-5 text-primary mb-2" />
                <p className="text-sm font-medium">{action.label}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
