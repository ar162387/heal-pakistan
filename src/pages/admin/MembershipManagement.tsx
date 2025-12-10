import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Download, Eye, Check, X, UserPlus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { MembershipApplication, MembershipStatus, MembershipType } from "@/types/membership";
import { listMembershipApplications, updateMembershipStatus } from "@/api/membership";

const statusOptions: (MembershipStatus | "all")[] = ["all", "pending", "approved", "rejected"];
const typeOptions: (MembershipType | "all")[] = ["all", "member", "volunteer", "donor"];

const MembershipManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [typeFilter, setTypeFilter] = useState<(typeof typeOptions)[number]>("all");
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["membership-applications"],
    queryFn: () => listMembershipApplications({}),
    enabled: !!role,
  });

  const applications = data ?? [];

  const filteredApplications = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (typeFilter !== "all" && app.join_as !== typeFilter) return false;
      if (!term) return true;
      return [app.full_name, app.email, app.phone, app.city, app.organization, app.motivation]
        .filter(Boolean)
        .some((value) => (value ?? "").toLowerCase().includes(term));
    });
  }, [applications, searchTerm, statusFilter, typeFilter]);

  const counts = useMemo(() => {
    const totals = { total: applications.length, pending: 0, approved: 0, rejected: 0 };
    applications.forEach((app) => {
      totals[app.status] += 1;
    });
    return totals;
  }, [applications]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MembershipStatus }) => updateMembershipStatus(id, status),
    onSuccess: (_, vars) => {
      toast({
        title: `Application ${vars.status === "approved" ? "approved" : "rejected"}`,
        description: "Status updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["membership-applications"] });
      setSelectedApplication((prev) => (prev ? { ...prev, status: vars.status } : prev));
    },
    onError: (error: unknown) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: MembershipStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleStatusChange = (id: string, status: MembershipStatus) => {
    statusMutation.mutate({ id, status });
  };

  const formatDate = (value: string) => new Date(value).toLocaleDateString();

  if (!role) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only authenticated admins can view membership applications.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground text-sm">Failed to load applications. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Membership Applications</h1>
          <p className="text-muted-foreground">Review and manage membership & volunteer applications</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{counts.total}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{counts.pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{counts.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{counts.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as (typeof statusOptions)[number])}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? "All Status" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as (typeof typeOptions)[number])}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "all" ? "All Types" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading applications...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filteredApplications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No applications found.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.full_name}</TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>{app.organization || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{app.join_as}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>{formatDate(app.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedApplication(app)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Application Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                          {selectedApplication && (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Name</p>
                                  <p className="font-medium">{selectedApplication.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium break-all">{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Phone</p>
                                  <p className="font-medium">{selectedApplication.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">City</p>
                                  <p className="font-medium">{selectedApplication.city}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Type</p>
                                  <p className="font-medium capitalize">{selectedApplication.join_as}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  <p className="font-medium">{selectedApplication.status}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Organization</p>
                                  <p className="font-medium">{selectedApplication.organization || "—"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Submitted On</p>
                                  <p className="font-medium">{formatDate(selectedApplication.created_at)}</p>
                                </div>
                              </div>
                              {selectedApplication.motivation && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Motivation</p>
                                  <p className="text-sm text-foreground whitespace-pre-line">{selectedApplication.motivation}</p>
                                </div>
                              )}
                              {selectedApplication.status === "pending" && (
                                <div className="flex gap-3 pt-4">
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleStatusChange(selectedApplication.id, "approved")}
                                    disabled={statusMutation.isPending}
                                  >
                                    {statusMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={() => handleStatusChange(selectedApplication.id, "rejected")}
                                    disabled={statusMutation.isPending}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    {app.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600"
                          onClick={() => handleStatusChange(app.id, "approved")}
                          disabled={statusMutation.isPending}
                        >
                          {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleStatusChange(app.id, "rejected")}
                          disabled={statusMutation.isPending}
                        >
                          {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipManagement;
