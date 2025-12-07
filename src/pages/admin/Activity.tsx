import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchRecentActivity } from "@/api/activity";
import { formatDistanceToNow } from "date-fns";

const Activity = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => fetchRecentActivity(25),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recent Activity</h1>
          <p className="text-muted-foreground">Audit trail of recent CRUD actions</p>
        </div>
        <button className="text-sm text-primary" onClick={() => refetch()} disabled={isLoading}>
          Refresh
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading activity...</p>}
          {isError && <p className="text-sm text-destructive">Failed to load activity.</p>}
          {!isLoading && !isError && (!data || data.length === 0) && (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          )}
          <div className="space-y-4">
            {data?.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.action}</Badge>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.entity}</span>
                  </div>
                  <p className="text-sm">
                    {item.actor?.name ?? "System"}{" "}
                    <span className="text-muted-foreground">
                      ({item.actor?.role ? item.actor.role.replace("_", " ") : "unknown"})
                    </span>
                  </p>
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <pre className="text-xs bg-muted px-3 py-2 rounded-md border border-border overflow-x-auto">
                      {JSON.stringify(item.metadata, null, 2)}
                    </pre>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activity;

