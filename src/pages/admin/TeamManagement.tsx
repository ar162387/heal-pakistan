import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload, Loader2, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { TeamMember, TeamRole } from "@/types/team";
import { createTeamMember, deleteTeamMember, listTeamMembers, updateTeamMember, uploadTeamPhoto } from "@/api/team";

type TeamFormState = {
  name: string;
  role: TeamRole;
  designation: string;
  university: string;
  description: string;
  is_published: boolean;
  photo_url?: string;
};

const emptyForm: TeamFormState = {
  name: "",
  role: "cabinet_member",
  designation: "",
  university: "",
  description: "",
  is_published: true,
};

const roleOptions: { value: TeamRole; label: string }[] = [
  { value: "founder", label: "Founder" },
  { value: "co-founder", label: "Co-Founder" },
  { value: "cabinet_member", label: "Cabinet Member" },
  { value: "chapter_lead", label: "Chapter Lead" },
  { value: "collaborator", label: "Collaborator" },
];

const allowedRoles = ["super_admin", "content_manager"] as const;

const TeamManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"leadership" | "cabinet" | "chapters" | "collaborators">("leadership");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<TeamFormState>(emptyForm);
  const [editForm, setEditForm] = useState<TeamFormState>(emptyForm);
  const [createPhoto, setCreatePhoto] = useState<File | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const isAllowed = role ? allowedRoles.includes(role as typeof allowedRoles[number]) : false;

  const { data: teamMembers, isLoading, isError } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => listTeamMembers({}),
    enabled: isAllowed,
  });

  const leadershipMembers = useMemo(() => {
    return teamMembers?.filter((m) => m.role === "founder" || m.role === "co-founder") ?? [];
  }, [teamMembers]);

  const cabinetMembers = useMemo(() => {
    return teamMembers?.filter((m) => m.role === "cabinet_member") ?? [];
  }, [teamMembers]);

  const chapterLeads = useMemo(() => {
    return teamMembers?.filter((m) => m.role === "chapter_lead") ?? [];
  }, [teamMembers]);

  const collaborators = useMemo(() => {
    return teamMembers?.filter((m) => m.role === "collaborator") ?? [];
  }, [teamMembers]);

  const createMutation = useMutation({
    mutationFn: async (payload: { form: TeamFormState; photoFile: File | null }) => {
      const { form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadTeamPhoto(photoFile) : undefined;
      return createTeamMember({
        name: form.name,
        role: form.role,
        designation: form.designation || undefined,
        university: form.university || undefined,
        description: form.description || undefined,
        photo_url: photoUrl,
        is_published: form.is_published,
      });
    },
    onSuccess: () => {
      toast({ title: "Team member added", description: "Member created successfully." });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      setCreatePhoto(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add member",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; form: TeamFormState; photoFile: File | null }) => {
      const { id, form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadTeamPhoto(photoFile) : undefined;
      return updateTeamMember(id, {
        name: form.name,
        role: form.role,
        designation: form.designation || undefined,
        university: form.university || undefined,
        description: form.description || undefined,
        photo_url: photoUrl,
        is_published: form.is_published,
      });
    },
    onSuccess: () => {
      toast({ title: "Member updated", description: "Changes saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      setIsEditOpen(false);
      setEditingMember(null);
      setEditForm(emptyForm);
      setEditPhoto(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update member",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      toast({ title: "Member deleted", description: "Team member removed successfully." });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to delete member",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      role: member.role,
      designation: member.designation ?? "",
      university: member.university ?? "",
      description: member.description ?? "",
      is_published: member.is_published,
      photo_url: member.photo_url ?? "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ form: createForm, photoFile: createPhoto });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMutation.mutate({ id: editingMember.id, form: editForm, photoFile: editPhoto });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  const getRoleDisplayName = (role: TeamRole) => {
    return roleOptions.find((r) => r.value === role)?.label || role;
  };

  const TeamCard = ({ member }: { member: TeamMember }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.designation || getRoleDisplayName(member.role)}</p>
                {member.university && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {member.university}
                  </Badge>
                )}
              </div>
              {!member.is_published && (
                <div title="Not published">
                  <EyeOff className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              )}
            </div>
            {member.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{member.description}</p>
            )}
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(member.id, member.name)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isAllowed) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only super admins or content managers can manage team members.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground text-sm">Failed to load team members. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Manage leadership, cabinet, and chapter leads</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {createPhoto ? (
                    <img src={URL.createObjectURL(createPhoto)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-photo">Photo</Label>
                  <Input
                    id="create-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCreatePhoto(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Square images work best (1:1).</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name *</Label>
                  <Input
                    id="create-name"
                    placeholder="Enter full name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-role">Role/Designation *</Label>
                  <Select
                    value={createForm.role}
                    onValueChange={(value) => setCreateForm({ ...createForm, role: value as TeamRole })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-designation">Designation (optional)</Label>
                  <Input
                    id="create-designation"
                    placeholder="e.g., Director of Programs"
                    value={createForm.designation}
                    onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-university">University (optional)</Label>
                  <Input
                    id="create-university"
                    placeholder="Type any university"
                    value={createForm.university}
                    onChange={(e) => setCreateForm({ ...createForm, university: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="create-is_published">Show on public site</Label>
                  <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                    <Switch
                      id="create-is_published"
                      checked={createForm.is_published}
                      onCheckedChange={(checked) => setCreateForm({ ...createForm, is_published: checked })}
                    />
                    <span className="text-sm text-muted-foreground">
                      {createForm.is_published ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-description">Description</Label>
                <Textarea
                  id="create-description"
                  rows={4}
                  placeholder="Brief description about this team member..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)} disabled={createMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="cabinet">Cabinet</TabsTrigger>
          <TabsTrigger value="chapters">Chapter Leads</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
        </TabsList>

        <TabsContent value="leadership" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : leadershipMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No leadership members yet. Add a founder or co-founder to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leadershipMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cabinet" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : cabinetMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No cabinet members yet. Add members to build your team.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cabinetMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : chapterLeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No chapter leads yet. Add chapter leads for each university.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapterLeads.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collaborators" className="mt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : collaborators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No collaborators yet. Add collaborators to showcase partnerships.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborators.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateSubmit}>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {editPhoto ? (
                  <img src={URL.createObjectURL(editPhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : editingMember?.photo_url ? (
                  <img src={editingMember.photo_url} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-photo">Photo</Label>
                <Input
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPhoto(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground mt-1">Upload a new photo to replace the current one.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter full name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role/Designation *</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm({ ...editForm, role: value as TeamRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-designation">Designation (optional)</Label>
                <Input
                  id="edit-designation"
                  placeholder="e.g., Director of Programs"
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-university">University (optional)</Label>
                <Input
                  id="edit-university"
                  placeholder="Type any university"
                  value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-is_published">Show on public site</Label>
                <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                  <Switch
                    id="edit-is_published"
                    checked={editForm.is_published}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, is_published: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {editForm.is_published ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                placeholder="Brief description about this team member..."
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)} disabled={updateMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
