import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, Upload, Quote, Loader2, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Testimonial, TestimonialCategory } from "@/types/testimonials";
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  updateTestimonial,
  uploadTestimonialPhoto,
} from "@/api/testimonials";

type TestimonialFormState = {
  category: TestimonialCategory;
  name: string;
  quote: string;
  role: string;
  institute: string;
  university: string;
  batch: string;
  is_published: boolean;
  photo_url?: string;
};

const emptyForm: TestimonialFormState = {
  category: "supporter",
  name: "",
  quote: "",
  role: "",
  institute: "",
  university: "",
  batch: "",
  is_published: true,
  photo_url: "",
};

const allowedRoles = ["super_admin", "content_manager"] as const;

const categoryOptions: { value: TestimonialCategory; label: string }[] = [
  { value: "supporter", label: "Supporter" },
  { value: "intern", label: "Intern" },
];

const TestimonialsManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TestimonialCategory>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<TestimonialFormState>(emptyForm);
  const [editForm, setEditForm] = useState<TestimonialFormState>(emptyForm);
  const [createPhoto, setCreatePhoto] = useState<File | null>(null);
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const isAllowed = role ? allowedRoles.includes(role as typeof allowedRoles[number]) : false;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => listTestimonials({}),
    enabled: isAllowed,
  });

  const testimonials = data ?? [];

  const filteredTestimonials = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return testimonials.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (!term) return true;
      return [item.name, item.quote, item.role, item.institute, item.university, item.batch].some((value) =>
        (value ?? "").toLowerCase().includes(term)
      );
    });
  }, [testimonials, searchTerm, categoryFilter]);

  const buildCreatePayload = (form: TestimonialFormState, photoUrl?: string | null) => ({
    category: form.category,
    name: form.name.trim(),
    quote: form.quote.trim(),
    role: form.category === "supporter" ? form.role.trim() : null,
    institute: form.category === "supporter" ? form.institute.trim() : null,
    university: form.category === "intern" ? form.university.trim() : null,
    batch: form.category === "intern" ? form.batch.trim() : null,
    photo_url: photoUrl ?? (form.photo_url?.trim() ? form.photo_url.trim() : null),
    is_published: form.is_published,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { form: TestimonialFormState; photoFile: File | null }) => {
      const { form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadTestimonialPhoto(photoFile) : null;
      return createTestimonial(buildCreatePayload(form, photoUrl));
    },
    onSuccess: () => {
      toast({ title: "Testimonial added", description: "Saved and ready for the site." });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      setCreatePhoto(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add testimonial",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; form: TestimonialFormState; photoFile: File | null }) => {
      const { id, form, photoFile } = payload;
      const photoUrl = photoFile ? await uploadTestimonialPhoto(photoFile) : null;
      return updateTestimonial(id, buildCreatePayload(form, photoUrl));
    },
    onSuccess: () => {
      toast({ title: "Testimonial updated", description: "Changes saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsEditOpen(false);
      setEditingTestimonial(null);
      setEditPhoto(null);
      setEditForm(emptyForm);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update testimonial",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast({ title: "Testimonial deleted", description: "Removed from the site." });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to delete testimonial",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const handleEditStart = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setEditForm({
      category: testimonial.category,
      name: testimonial.name,
      quote: testimonial.quote,
      role: testimonial.role ?? "",
      institute: testimonial.institute ?? "",
      university: testimonial.university ?? "",
      batch: testimonial.batch ?? "",
      is_published: testimonial.is_published,
      photo_url: testimonial.photo_url ?? "",
    });
    setEditPhoto(null);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ form: createForm, photoFile: createPhoto });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    updateMutation.mutate({ id: editingTestimonial.id, form: editForm, photoFile: editPhoto });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    deleteMutation.mutate(id);
  };

  const handleCreateDialogChange = (open: boolean) => {
    setIsCreateOpen(open);
    if (!open) {
      setCreateForm(emptyForm);
      setCreatePhoto(null);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) {
      setEditingTestimonial(null);
      setEditPhoto(null);
      setEditForm(emptyForm);
    }
  };

  if (!isAllowed) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only super admins or content managers can manage testimonials.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground text-sm">Failed to load testimonials. Please try again.</p>
      </div>
    );
  }

  const CategoryBadge = ({ category }: { category: TestimonialCategory }) => (
    <Badge variant="secondary" className="capitalize">
      {category === "supporter" ? "Supporter" : "Intern"}
    </Badge>
  );

  const renderMeta = (testimonial: Testimonial) => {
    if (testimonial.category === "supporter") {
      return (
        <>
          {testimonial.role && <p className="text-sm text-muted-foreground">{testimonial.role}</p>}
          {testimonial.institute && <p className="text-xs text-muted-foreground">{testimonial.institute}</p>}
        </>
      );
    }
    return (
      <>
        {testimonial.university && <p className="text-sm text-muted-foreground">{testimonial.university}</p>}
        {testimonial.batch && <p className="text-xs text-primary">Batch {testimonial.batch}</p>}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">Manage quotes from supporters and interns.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={handleCreateDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add Testimonial</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {createPhoto ? (
                    <img src={URL.createObjectURL(createPhoto)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
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
                  <p className="text-xs text-muted-foreground mt-1">Square images work best.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-category">Type</Label>
                  <Select
                    value={createForm.category}
                    onValueChange={(value) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        category: value as TestimonialCategory,
                        role: "",
                        institute: "",
                        university: "",
                        batch: "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    placeholder="Enter full name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {createForm.category === "supporter" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-role">Role</Label>
                    <Input
                      id="create-role"
                      placeholder="e.g., Professor"
                      value={createForm.role}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-institute">Institute</Label>
                    <Input
                      id="create-institute"
                      placeholder="e.g., National Defence University"
                      value={createForm.institute}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, institute: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-university">University</Label>
                    <Input
                      id="create-university"
                      placeholder="e.g., QAU"
                      value={createForm.university}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, university: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-batch">Batch (Year)</Label>
                    <Input
                      id="create-batch"
                      placeholder="e.g., 2024"
                      value={createForm.batch}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, batch: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="create-quote">Quote</Label>
                <Textarea
                  id="create-quote"
                  placeholder="Enter the testimonial..."
                  rows={4}
                  value={createForm.quote}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, quote: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                <Switch
                  id="create-is_published"
                  checked={createForm.is_published}
                  onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="create-is_published" className="text-sm text-muted-foreground">
                  {createForm.is_published ? "Visible on site" : "Hidden"}
                </Label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => handleCreateDialogChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as "all" | TestimonialCategory)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="supporter">Supporters</SelectItem>
            <SelectItem value="intern">Interns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredTestimonials.length === 0 && (
        <p className="text-muted-foreground">No testimonials found. Add one to get started.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                  {testimonial.photo_url ? (
                    <img src={testimonial.photo_url} alt={testimonial.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <CategoryBadge category={testimonial.category} />
                        {!testimonial.is_published && <EyeOff className="h-4 w-4 text-muted-foreground" title="Hidden" />}
                      </div>
                      {renderMeta(testimonial)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <Quote className="h-5 w-5 text-primary/40" />
                    <p className="text-sm text-muted-foreground italic mt-1">"{testimonial.quote}"</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => handleEditStart(testimonial)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateSubmit}>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {editPhoto ? (
                  <img src={URL.createObjectURL(editPhoto)} alt="Preview" className="w-full h-full object-cover" />
                ) : editingTestimonial?.photo_url ? (
                  <img src={editingTestimonial.photo_url} alt={editingTestimonial.name} className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-photo">Photo</Label>
                <Input id="edit-photo" type="file" accept="image/*" onChange={(e) => setEditPhoto(e.target.files?.[0] ?? null)} />
                <p className="text-xs text-muted-foreground mt-1">Upload a new photo to replace the current one.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Type</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: value as TestimonialCategory,
                      role: "",
                      institute: "",
                      university: "",
                      batch: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            {editForm.category === "supporter" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Input
                    id="edit-role"
                    value={editForm.role}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-institute">Institute</Label>
                  <Input
                    id="edit-institute"
                    value={editForm.institute}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, institute: e.target.value }))}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-university">University</Label>
                  <Input
                    id="edit-university"
                    value={editForm.university}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, university: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-batch">Batch (Year)</Label>
                  <Input
                    id="edit-batch"
                    value={editForm.batch}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, batch: e.target.value }))}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-quote">Quote</Label>
              <Textarea
                id="edit-quote"
                rows={4}
                value={editForm.quote}
                onChange={(e) => setEditForm((prev) => ({ ...prev, quote: e.target.value }))}
                required
              />
            </div>

            <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
              <Switch
                id="edit-is_published"
                checked={editForm.is_published}
                onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="edit-is_published" className="text-sm text-muted-foreground">
                {editForm.is_published ? "Visible on site" : "Hidden"}
              </Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => handleEditDialogChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManagement;
