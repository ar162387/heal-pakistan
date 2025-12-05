import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockTeam = {
  leadership: [
    { id: 1, name: "Habib ur Rehman", role: "Founder", image: "/placeholder.svg" },
    { id: 2, name: "Vaneeza Khan", role: "Co-Founder", image: "/placeholder.svg" },
  ],
  cabinet: [
    { id: 3, name: "Member 1", role: "Cabinet Member", image: "/placeholder.svg" },
    { id: 4, name: "Member 2", role: "Cabinet Member", image: "/placeholder.svg" },
    { id: 5, name: "Member 3", role: "Cabinet Member", image: "/placeholder.svg" },
  ],
  chapters: [
    { id: 6, name: "Chapter Lead NDU", role: "Chapter Lead", university: "NDU", image: "/placeholder.svg" },
    { id: 7, name: "Chapter Lead IIUI", role: "Chapter Lead", university: "IIUI", image: "/placeholder.svg" },
  ],
};

const TeamManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const TeamCard = ({ member }: { member: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            {member.university && (
              <Badge variant="outline" className="mt-1 text-xs">{member.university}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage leadership, cabinet, and chapter leads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role/Designation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="co-founder">Co-Founder</SelectItem>
                    <SelectItem value="cabinet">Cabinet Member</SelectItem>
                    <SelectItem value="chapter-lead">Chapter Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University (for Chapter Leads)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ndu">NDU</SelectItem>
                    <SelectItem value="iiui">IIUI</SelectItem>
                    <SelectItem value="numl">NUML</SelectItem>
                    <SelectItem value="iqra">Iqra University</SelectItem>
                    <SelectItem value="fjwu">FJWU</SelectItem>
                    <SelectItem value="qau">QAU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">Add Member</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="leadership">
        <TabsList>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
          <TabsTrigger value="chapters">Chapter Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="leadership" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTeam.leadership.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cabinet" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTeam.cabinet.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTeam.chapters.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
