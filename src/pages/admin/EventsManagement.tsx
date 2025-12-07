import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Pencil, Trash2, Calendar, MapPin, Upload, Loader2, Star, EyeOff, Eye, ArrowUp, ArrowDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/events";
import { createEvent, deleteEvent, listEvents, removeEventGalleryImage, updateEvent, uploadEventImage } from "@/api/events";

type EventFormState = {
  title: string;
  description: string;
  location: string;
  starts_at: string;
  ends_at: string;
  hero_image_url?: string | null;
  slug?: string;
  is_featured: boolean;
  is_published: boolean;
};

const emptyForm: EventFormState = {
  title: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
  hero_image_url: "",
  slug: "",
  is_featured: false,
  is_published: true,
};

const allowedRoles = ["super_admin", "content_manager"] as const;

type QueuedImage = {
  id: string;
  file: File;
  preview: string;
};

const makeQueuedImages = (files: File[]) =>
  files.map((file) => ({
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
  }));

const revokeQueued = (items: QueuedImage[]) => {
  items.forEach((item) => URL.revokeObjectURL(item.preview));
};

const moveQueuedImage = (items: QueuedImage[], id: string, direction: "up" | "down") => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return items;
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= items.length) return items;
  const next = [...items];
  const [removed] = next.splice(index, 1);
  next.splice(targetIndex, 0, removed);
  return next;
};

const formatInputDate = (value?: string | null) => {
  if (!value) return "";
  return value.slice(0, 16);
};

const EventsManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<EventFormState>(emptyForm);
  const [editForm, setEditForm] = useState<EventFormState>(emptyForm);
  const [createBanner, setCreateBanner] = useState<File | null>(null);
  const [editBanner, setEditBanner] = useState<File | null>(null);
  const [createGalleryFiles, setCreateGalleryFiles] = useState<QueuedImage[]>([]);
  const [editGalleryFiles, setEditGalleryFiles] = useState<QueuedImage[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const isAllowed = role ? allowedRoles.includes(role as typeof allowedRoles[number]) : false;

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
    enabled: isAllowed,
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const term = searchTerm.toLowerCase();
    return events.filter((event) => {
      if (!term) return true;
      return (
        event.title.toLowerCase().includes(term) ||
        (event.location?.toLowerCase().includes(term) ?? false) ||
        (event.description?.toLowerCase().includes(term) ?? false)
      );
    });
  }, [events, searchTerm]);

  const createMutation = useMutation({
    mutationFn: async (payload: { form: EventFormState; bannerFile: File | null; galleryFiles: QueuedImage[] }) => {
      const { form, bannerFile, galleryFiles } = payload;
      const heroUrl = bannerFile ? await uploadEventImage(bannerFile) : form.hero_image_url ?? null;
      const galleryUrls = galleryFiles.length
        ? await Promise.all(galleryFiles.map((item) => uploadEventImage(item.file)))
        : [];

      return createEvent(
        {
          ...form,
          hero_image_url: heroUrl,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : "",
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          slug: form.slug || undefined,
        },
        galleryUrls
      );
    },
    onSuccess: () => {
      toast({ title: "Event created", description: "Event saved and ready for the site." });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      setCreateBanner(null);
      setCreateGalleryFiles((prev) => {
        revokeQueued(prev);
        return [];
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to create event",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; form: EventFormState; bannerFile: File | null; galleryFiles: QueuedImage[] }) => {
      const { id, form, bannerFile, galleryFiles } = payload;
      const heroUrl = bannerFile ? await uploadEventImage(bannerFile) : form.hero_image_url ?? null;
      const galleryUrls = galleryFiles.length
        ? await Promise.all(galleryFiles.map((item) => uploadEventImage(item.file)))
        : [];

      return updateEvent(
        id,
        {
          ...form,
          hero_image_url: heroUrl,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : "",
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          slug: form.slug || undefined,
        },
        galleryUrls
      );
    },
    onSuccess: () => {
      toast({ title: "Event updated", description: "Changes saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsEditOpen(false);
      setEditingEvent(null);
      setEditBanner(null);
      setEditGalleryFiles((prev) => {
        revokeQueued(prev);
        return [];
      });
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
    mutationFn: deleteEvent,
    onSuccess: () => {
      toast({ title: "Event deleted", description: "Event removed along with its gallery." });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const removeGalleryMutation = useMutation({
    mutationFn: removeEventGalleryImage,
    onSuccess: (_data, imageId) => {
      toast({ title: "Photo removed", description: "Gallery image deleted." });
      setEditingEvent((prev) =>
        prev ? { ...prev, gallery: prev.gallery?.filter((img) => img.id !== imageId) ?? [] } : prev
      );
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to remove photo",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const addCreateGalleryFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const queued = makeQueuedImages(Array.from(fileList));
    setCreateGalleryFiles((prev) => [...prev, ...queued]);
  };

  const addEditGalleryFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const queued = makeQueuedImages(Array.from(fileList));
    setEditGalleryFiles((prev) => [...prev, ...queued]);
  };

  const removeQueued = (items: QueuedImage[], id: string) => {
    const target = items.find((item) => item.id === id);
    if (target) URL.revokeObjectURL(target.preview);
    return items.filter((item) => item.id !== id);
  };

  const handleRemoveCreateQueued = (id: string) => {
    setCreateGalleryFiles((prev) => removeQueued(prev, id));
  };

  const handleRemoveEditQueued = (id: string) => {
    setEditGalleryFiles((prev) => removeQueued(prev, id));
  };

  const handleReorderCreateQueued = (id: string, direction: "up" | "down") => {
    setCreateGalleryFiles((prev) => moveQueuedImage(prev, id, direction));
  };

  const handleReorderEditQueued = (id: string, direction: "up" | "down") => {
    setEditGalleryFiles((prev) => moveQueuedImage(prev, id, direction));
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setEditBanner(null);
    setEditGalleryFiles((prev) => {
      revokeQueued(prev);
      return [];
    });
    setEditForm({
      title: event.title,
      description: event.description,
      location: event.location ?? "",
      starts_at: formatInputDate(event.starts_at),
      ends_at: formatInputDate(event.ends_at ?? undefined),
      hero_image_url: event.hero_image_url ?? "",
      slug: event.slug,
      is_featured: event.is_featured,
      is_published: event.is_published,
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ form: createForm, bannerFile: createBanner, galleryFiles: createGalleryFiles });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    updateMutation.mutate({ id: editingEvent.id, form: editForm, bannerFile: editBanner, galleryFiles: editGalleryFiles });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this event and its gallery? This cannot be undone.")) return;
    deleteMutation.mutate(id);
  };

  if (!isAllowed) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only super admins or content managers can manage events.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Events Management</h1>
          <p className="text-muted-foreground">Create new event pages, manage highlights, and curate galleries.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (optional)</Label>
                  <Input
                    id="slug"
                    placeholder="event-slug"
                    value={createForm.slug}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="starts_at">Start</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={createForm.starts_at}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, starts_at: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ends_at">End (optional)</Label>
                  <Input
                    id="ends_at"
                    type="datetime-local"
                    value={createForm.ends_at}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, ends_at: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={createForm.location}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, venue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero">Banner Image</Label>
                  <Input
                    id="hero"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCreateBanner(e.target.files?.[0] ?? null)}
                  />
                  <p className="text-xs text-muted-foreground">High-quality cover for event page and highlights.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What will attendees experience? Who should join?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery">Event Gallery</Label>
                <Input
                  id="gallery"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => addCreateGalleryFiles(e.target.files)}
                />
                <p className="text-xs text-muted-foreground">
                  Upload multiple photos; you can delete any later from the gallery list.
                </p>
                {createGalleryFiles.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-3">
                    {createGalleryFiles.map((item, index) => (
                      <div key={item.id} className="relative group">
                        <img src={item.preview} alt={`Preview ${index + 1}`} className="h-20 w-28 object-cover rounded border" />
                        <div className="absolute inset-0 flex items-start justify-end gap-1 p-1 opacity-0 group-hover:opacity-100 transition">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-7 w-7"
                            type="button"
                            onClick={() => handleRemoveCreateQueued(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex gap-1 pt-1 justify-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleReorderCreateQueued(item.id, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleReorderCreateQueued(item.id, "down")}
                            disabled={index === createGalleryFiles.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={createForm.is_featured}
                    onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, is_featured: checked }))}
                  />
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Feature in highlights carousel
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={createForm.is_published}
                    onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, is_published: checked }))}
                  />
                  <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Visible to public
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && <p className="text-destructive">Failed to load events. Please refresh.</p>}

      {!isLoading && filteredEvents.length === 0 && (
        <p className="text-muted-foreground">No events found. Create one to get started.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => {
          const isUpcoming = new Date(event.starts_at) > new Date();
          return (
            <Card key={event.id}>
              {event.hero_image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={event.hero_image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge variant={isUpcoming ? "default" : "secondary"}>{isUpcoming ? "upcoming" : "completed"}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.starts_at).toLocaleDateString()}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  )}
                  {event.is_featured && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-4 w-4" />
                      Highlighted
                    </span>
                  )}
                  {!event.is_published && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <EyeOff className="h-4 w-4" />
                      Hidden
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{event.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>{event.gallery?.length ?? 0} gallery photos</span>
                  <span>Starts {new Date(event.starts_at).toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => startEdit(event)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(event.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={editForm.slug}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-starts_at">Start</Label>
                <Input
                  id="edit-starts_at"
                  type="datetime-local"
                  value={editForm.starts_at}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, starts_at: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ends_at">End</Label>
                <Input
                  id="edit-ends_at"
                  type="datetime-local"
                  value={editForm.ends_at}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, ends_at: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hero">Banner Image</Label>
                <Input
                  id="edit-hero"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditBanner(e.target.files?.[0] ?? null)}
                />
                {editForm.hero_image_url && <p className="text-xs text-muted-foreground">Current: {editForm.hero_image_url}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Existing Gallery</Label>
              <div className="flex flex-wrap gap-2">
                {editingEvent?.gallery?.length ? (
                  editingEvent.gallery.map((img) => (
                    <div key={img.id} className="relative">
                      <img src={img.image_url} alt="Gallery" className="h-16 w-24 object-cover rounded border" />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeGalleryMutation.mutate(img.id)}
                        type="button"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No photos yet.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gallery">Add Gallery Photos</Label>
              <Input
                id="edit-gallery"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => addEditGalleryFiles(e.target.files)}
              />
              {editGalleryFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-3">
                  {editGalleryFiles.map((item, index) => (
                    <div key={item.id} className="relative group">
                      <img src={item.preview} alt={`Preview ${index + 1}`} className="h-20 w-28 object-cover rounded border" />
                      <div className="absolute inset-0 flex items-start justify-end gap-1 p-1 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7"
                          type="button"
                          onClick={() => handleRemoveEditQueued(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex gap-1 pt-1 justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorderEditQueued(item.id, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorderEditQueued(item.id, "down")}
                          disabled={index === editGalleryFiles.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={editForm.is_featured}
                  onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_featured: checked }))}
                />
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Feature in highlights carousel
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={editForm.is_published}
                  onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_published: checked }))}
                />
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Visible to public
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
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

export default EventsManagement;
