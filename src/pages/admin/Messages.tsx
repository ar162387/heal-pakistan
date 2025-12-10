import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Eye, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ContactMessage, MessageStatus } from "@/types/messages";
import { listMessages, updateMessageStatus } from "@/api/messages";

const statusOptions: (MessageStatus | "all")[] = ["all", "new", "read"];

const Messages = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["messages"],
    queryFn: () => listMessages({}),
    enabled: !!role,
  });

  const messages = data ?? [];

  const filteredMessages = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return messages.filter((msg) => {
      if (statusFilter !== "all" && msg.status !== statusFilter) return false;
      if (!term) return true;
      return [msg.name, msg.email, msg.subject, msg.message]
        .filter(Boolean)
        .some((value) => (value ?? "").toLowerCase().includes(term));
    });
  }, [messages, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    const totals = { total: messages.length, new: 0, read: 0 };
    messages.forEach((msg) => {
      totals[msg.status] += 1;
    });
    return totals;
  }, [messages]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) => updateMessageStatus(id, status),
    onSuccess: (_, vars) => {
      toast({ title: "Updated", description: `Message marked as ${vars.status}.` });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setSelected((prev) => (prev && prev.id === vars.id ? { ...prev, status: vars.status } : prev));
    },
    onError: (error: unknown) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: MessageStatus) => {
    return status === "new" ? (
      <Badge className="bg-blue-500/15 text-blue-700">New</Badge>
    ) : (
      <Badge variant="secondary">Read</Badge>
    );
  };

  const formatDate = (value: string) => new Date(value).toLocaleString();

  const handleMarkRead = (id: string) => statusMutation.mutate({ id, status: "read" });

  if (!role) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only authenticated admins can view messages.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground text-sm">Failed to load messages. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground">View and respond to contact form submissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.total}</p>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.new}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.read}</p>
              <p className="text-xs text-muted-foreground">Read</p>
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
                placeholder="Search messages..."
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading messages...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filteredMessages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No messages found.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                filteredMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell className="break-all">{msg.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
                    <TableCell>{getStatusBadge(msg.status)}</TableCell>
                    <TableCell>{formatDate(msg.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelected(msg)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden">
                          <DialogHeader>
                            <DialogTitle>Message Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            {selected && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{selected.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium break-all">{selected.email}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-sm text-muted-foreground">Subject</p>
                                    <p className="font-medium">{selected.subject}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium capitalize">{selected.status}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Received</p>
                                    <p className="font-medium">{formatDate(selected.created_at)}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Message</p>
                                  <p className="text-sm text-foreground whitespace-pre-line">{selected.message}</p>
                                </div>
                                {selected.status === "new" && (
                                  <div className="flex gap-3 pt-3">
                                    <Button
                                      className="flex-1"
                                      onClick={() => handleMarkRead(selected.id)}
                                      disabled={statusMutation.isPending}
                                    >
                                      {statusMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                      Mark as Read
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      {msg.status === "new" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600"
                          onClick={() => handleMarkRead(msg.id)}
                          disabled={statusMutation.isPending}
                        >
                          {statusMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        </Button>
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

export default Messages;
