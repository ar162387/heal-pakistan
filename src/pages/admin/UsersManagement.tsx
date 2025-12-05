import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, Shield, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockUsers = [
  { id: 1, name: "Habib ur Rehman", email: "habib@healpakistan.org", role: "super_admin", status: "active", lastLogin: "2024-02-15" },
  { id: 2, name: "Vaneeza Khan", email: "vaneeza@healpakistan.org", role: "super_admin", status: "active", lastLogin: "2024-02-14" },
  { id: 3, name: "Content Manager 1", email: "content1@healpakistan.org", role: "content_manager", status: "active", lastLogin: "2024-02-13" },
  { id: 4, name: "Member User", email: "member@example.com", role: "member", status: "active", lastLogin: "2024-02-10" },
];

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "super_admin":
        return <ShieldCheck className="h-4 w-4 text-primary" />;
      case "content_manager":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return <Badge className="bg-primary/20 text-primary">Super Admin</Badge>;
      case "content_manager":
        return <Badge className="bg-blue-500/20 text-blue-700">Content Manager</Badge>;
      default:
        return <Badge variant="secondary">Member</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage admin accounts and permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Super Admin
                      </div>
                    </SelectItem>
                    <SelectItem value="content_manager">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Content Manager
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Member
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" type="password" placeholder="Enter temporary password" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">Create User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Super Admin</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Full access to all settings</li>
                <li>• Create/delete admin accounts</li>
                <li>• Manage sensitive member data</li>
                <li>• All content management</li>
              </ul>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Content Manager</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create/edit/publish posts</li>
                <li>• Manage events and blogs</li>
                <li>• Update programs content</li>
                <li>• No access to core settings</li>
              </ul>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Member</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Read-only dashboard view</li>
                <li>• Access exclusive updates</li>
                <li>• View member content</li>
                <li>• No editing permissions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default UsersManagement;
