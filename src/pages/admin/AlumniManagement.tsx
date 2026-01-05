import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AlumniProfile } from "@/types/alumni";
import { createAlumni, deleteAlumni, listAlumni, updateAlumni, uploadAlumniPhoto } from "@/api/alumni";
import { Plus, Search, Pencil, Trash2, Upload, Mail, Phone, EyeOff, Check, Loader2 } from "lucide-react";

type AlumniFormState = {
  full_name: string;
  university: string;
  batch: string;
  bio: string;
  contact_email: string;
  contact_phone: string;
  is_published: boolean;
  profile_photo_url?: string;
};

const emptyForm: AlumniFormState = {
  full_name: "",
  university: "",
  batch: "",
  bio: "",
  contact_email: "",
  contact_phone: "",
  is_published: true,
};

const allowedRoles = ["super_admin", "content_manager"] as const;

const AlumniManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState<string | null>(null);
  const [universityFilter, setUniversityFilter] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<AlumniFormState>(emptyForm);
  const [editForm, setEditForm] = useState<AlumniFormState>(emptyForm);
  const [createPhoto, setCreatePhoto] = useState<File | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniProfile | null>(null);

  const isAllowed = role ? allowedRoles.includes(role as typeof allowedRoles[number]) : false;

  const { data: alumni, isLoading, isError } = useQuery({
    queryKey: ["alumni", searchTerm, batchFilter, universityFilter],
    queryFn: () =>
      listAlumni({
        search: searchTerm || undefined,
        batch: batchFilter || undefined,
        university: universityFilter || undefined,
      }),
    enabled: isAllowed,
  });

  const universities = useMemo(() => {
    const values = new Set<string>();
    alumni?.forEach((item) => {
      if (item.university) values.add(item.university);
    });
    return Array.from(values);
  }, [alumni]);

  const batches = useMemo(() => {
    const values = new Set<string>();
    alumni?.forEach((item) => {
      if (item.batch) values.add(item.batch);
    });
    return Array.from(values);
  }, [alumni]);

  const createMutation = useMutation({
    mutationFn: async (payload: { form: AlumniFormState; photoFile: File | null }) => {
      const { form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadAlumniPhoto(photoFile) : undefined;
      return createAlumni({ ...form, profile_photo_url: photoUrl });
    },
    onSuccess: () => {
      toast({ title: "Alumni added", description: "Profile created successfully." });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      setCreatePhoto(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add alumni",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; form: AlumniFormState; photoFile: File | null }) => {
      const { id, form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadAlumniPhoto(photoFile) : form.profile_photo_url;
      return updateAlumni(id, { ...form, profile_photo_url: photoUrl });
    },
    onSuccess: () => {
      toast({ title: "Alumni updated", description: "Profile saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      setIsEditOpen(false);
      setEditingAlumni(null);
      setEditPhoto(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlumni,
    onSuccess: () => {
      toast({ title: "Alumni removed", description: "Profile deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const startEdit = (profile: AlumniProfile) => {
    setEditingAlumni(profile);
    setEditForm({
      full_name: profile.full_name,
      university: profile.university,
      batch: profile.batch,
      bio: profile.bio ?? "",
      contact_email: profile.contact_email ?? "",
      contact_phone: profile.contact_phone ?? "",
      is_published: profile.is_published,
      profile_photo_url: profile.profile_photo_url ?? "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ form: createForm, photoFile: createPhoto });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni) return;
    updateMutation.mutate({ id: editingAlumni.id, form: editForm, photoFile: editPhoto });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this alumni profile? This cannot be undone.")) return;
    deleteMutation.mutate(id);
  };

  if (!isAllowed) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only super admins or content managers can manage alumni.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alumni Management</h1>
          <p className="text-muted-foreground">Upload photos, tag batches, and manage contact details.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Alumni</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {createPhoto ? (
                    <img src={URL.createObjectURL(createPhoto)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="create-photo">Profile Photo</Label>
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
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Enter full name"
                    value={createForm.full_name}
                    onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="e.g., National Defence University"
                    value={createForm.university}
                    onChange={(e) => setCreateForm({ ...createForm, university: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Internship Batch</Label>
                  <Input
                    id="batch"
                    placeholder="e.g., Summer 2024"
                    value={createForm.batch}
                    onChange={(e) => setCreateForm({ ...createForm, batch: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email (admin only)</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    placeholder="Email for internal use"
                    value={createForm.contact_email}
                    onChange={(e) => setCreateForm({ ...createForm, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone (admin only)</Label>
                  <Input
                    id="contact_phone"
                    placeholder="Phone for internal use"
                    value={createForm.contact_phone}
                    onChange={(e) => setCreateForm({ ...createForm, contact_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_published">Show on public site</Label>
                  <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                    <Switch
                      id="is_published"
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
                <Label htmlFor="bio">Description / Highlights</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  placeholder="Short description for the internship alumni card"
                  value={createForm.bio}
                  onChange={(e) => setCreateForm({ ...createForm, bio: e.target.value })}
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
                    "Save Alumni"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, university, or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={universityFilter ?? "all"} onValueChange={(v) => setUniversityFilter(v === "all" ? null : v)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by university" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={batchFilter ?? "all"} onValueChange={(v) => setBatchFilter(v === "all" ? null : v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading alumni...</p>}
          {isError && <p className="text-sm text-destructive">Failed to load alumni.</p>}
          {!isLoading && alumni && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact (admin only)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumni.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.profile_photo_url ? (
                        <img
                          src={item.profile_photo_url}
                          alt={item.full_name}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                          No photo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.full_name}</span>
                        {item.bio && <span className="text-xs text-muted-foreground line-clamp-1">{item.bio}</span>}
                      </div>
                    </TableCell>
                    <TableCell>{item.university}</TableCell>
                    <TableCell>{item.batch}</TableCell>
                    <TableCell>
                      {item.is_published ? (
                        <Badge className="bg-green-600/15 text-green-700 inline-flex items-center gap-1">
                          <Check className="h-3 w-3" /> Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        {item.contact_email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{item.contact_email}</span>
                          </div>
                        )}
                        {item.contact_phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{item.contact_phone}</span>
                          </div>
                        )}
                        {!item.contact_email && !item.contact_phone && (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {alumni.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-6">
                      No alumni match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Alumni</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateSubmit}>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {editPhoto ? (
                  <img src={URL.createObjectURL(editPhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : editForm.profile_photo_url ? (
                  <img src={editForm.profile_photo_url} alt={editForm.full_name} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-photo">Profile Photo</Label>
                <Input
                  id="edit-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPhoto(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground mt-1">Upload to replace existing photo.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_full_name">Full Name</Label>
                <Input
                  id="edit_full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_university">University</Label>
                <Input
                  id="edit_university"
                  value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_batch">Internship Batch</Label>
                <Input
                  id="edit_batch"
                  value={editForm.batch}
                  onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_contact_email">Contact Email</Label>
                <Input
                  id="edit_contact_email"
                  type="email"
                  value={editForm.contact_email}
                  onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_contact_phone">Contact Phone</Label>
                <Input
                  id="edit_contact_phone"
                  value={editForm.contact_phone}
                  onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_is_published">Show on public site</Label>
                <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                  <Switch
                    id="edit_is_published"
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
              <Label htmlFor="edit_bio">Description / Highlights</Label>
              <Textarea
                id="edit_bio"
                rows={4}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
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

export default AlumniManagement;
