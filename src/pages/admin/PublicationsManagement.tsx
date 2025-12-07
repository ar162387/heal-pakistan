import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Pencil, Trash2, Upload, Eye, FileText, Image, ExternalLink, Expand, Minimize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Publication, PublicationStatus, PublicationType } from "@/types/publications";
import { createPublication, deletePublication, listPublications, updatePublication, uploadPublicationImage } from "@/api/publications";
import RichTextContent from "@/components/RichTextContent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type PublicationForm = {
  title: string;
  author: string;
  published_on: string;
  type: PublicationType;
  status: PublicationStatus;
  category: string;
  content: string;
  cover_image_url?: string | null;
  external_url?: string;
};

const emptyForm: PublicationForm = {
  title: "",
  author: "",
  published_on: "",
  type: "article",
  status: "draft",
  category: "General",
  content: "",
  cover_image_url: "",
  external_url: "",
};

const allowedRoles = ["super_admin", "content_manager"] as const;

const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
];

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const RichTextEditor = ({ value, onChange, placeholder }: EditorProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Rich text content</p>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFullscreen(true);
            }} 
            className="gap-2"
          >
            <Expand className="h-4 w-4" />
            Full screen
          </Button>
        </div>
        <div className="border border-border rounded-md overflow-hidden">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={quillModules}
            formats={quillFormats}
            placeholder={placeholder}
            className="min-h-[240px]"
          />
        </div>
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent 
          className="max-w-[98vw] max-h-[98vh] w-full h-full flex flex-col p-6 [&>button]:hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Content - Fullscreen</DialogTitle>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                className="gap-2"
              >
                <Minimize className="h-4 w-4" />
                Exit fullscreen
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 min-h-0 border border-border rounded-md overflow-hidden mt-4">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              modules={quillModules}
              formats={quillFormats}
              placeholder={placeholder}
              className="h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const PublicationsManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<PublicationForm>(emptyForm);
  const [editForm, setEditForm] = useState<PublicationForm>(emptyForm);
  const [createCover, setCreateCover] = useState<File | null>(null);
  const [editCover, setEditCover] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState<Publication | null>(null);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);

  const isAllowed = role ? allowedRoles.includes(role as typeof allowedRoles[number]) : false;

  const { data: publications, isLoading, isError } = useQuery({
    queryKey: ["publications", searchTerm],
    queryFn: () =>
      listPublications({
        search: searchTerm || undefined,
      }),
    enabled: isAllowed,
  });

  const filteredPublications = useMemo(() => publications ?? [], [publications]);

  const uploadCoverIfNeeded = async (file: File | null, fallback?: string | null) => {
    if (file) return uploadPublicationImage(file);
    return fallback ?? null;
  };

  const createMutation = useMutation({
    mutationFn: async (payload: { form: PublicationForm; status: PublicationStatus }) => {
      const { form, status } = payload;
      const coverUrl = await uploadCoverIfNeeded(createCover, form.cover_image_url ?? null);
      return createPublication({
        ...form,
        status,
        category: form.category || "General",
        is_published: status === "published",
        cover_image_url: coverUrl,
        published_on: form.published_on || new Date().toISOString().slice(0, 10),
      });
    },
    onSuccess: () => {
      toast({ title: "Publication saved", description: "Entry created successfully." });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setIsCreateOpen(false);
      setCreateForm(emptyForm);
      setCreateCover(null);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; form: PublicationForm; status: PublicationStatus }) => {
      const { id, form, status } = payload;
      const coverUrl = await uploadCoverIfNeeded(editCover, form.cover_image_url ?? null);
      return updatePublication(id, {
        ...form,
        status,
        category: form.category || "General",
        is_published: status === "published",
        cover_image_url: coverUrl,
        published_on: form.published_on || new Date().toISOString().slice(0, 10),
      });
    },
    onSuccess: () => {
      toast({ title: "Publication updated", description: "Changes saved successfully." });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setIsEditOpen(false);
      setEditingPublication(null);
      setEditCover(null);
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
    mutationFn: deletePublication,
    onSuccess: () => {
      toast({ title: "Publication removed", description: "Deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["publications"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const startEdit = (pub: Publication) => {
    setEditingPublication(pub);
    setEditCover(null);
    setEditForm({
      title: pub.title,
      author: pub.author,
      published_on: pub.published_on,
      type: pub.type,
      category: pub.category || "General",
      status: pub.status,
      content: pub.content,
      cover_image_url: pub.cover_image_url ?? "",
      external_url: pub.external_url ?? "",
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (status: PublicationStatus) => (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ form: createForm, status });
  };

  const handleUpdateSubmit = (status: PublicationStatus) => (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPublication) return;
    updateMutation.mutate({ id: editingPublication.id, form: editForm, status });
  };

  const renderCard = (pub: Publication) => {
    const cover = pub.cover_image_url || "/placeholder.svg";
    return (
      <Card key={pub.id}>
        <CardContent className="p-0">
          <div className="aspect-video overflow-hidden">
            <img src={cover} alt={pub.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {pub.type === "article" ? <FileText className="h-3 w-3 mr-1" /> : <Image className="h-3 w-3 mr-1" />}
                  {pub.type}
                </Badge>
                {pub.category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {pub.category}
                  </Badge>
                )}
              </div>
              <Badge variant={pub.status === "published" ? "default" : "secondary"} className="text-xs capitalize">
                {pub.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm line-clamp-2">{pub.title}</h3>
            <p className="text-xs text-muted-foreground">
              {pub.author} • {new Date(pub.published_on).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setPreviewContent(pub)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              {pub.external_url && (
                <Button asChild variant="ghost" size="icon">
                  <a href={pub.external_url} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => startEdit(pub)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  if (!confirm("Delete this publication?")) return;
                  deleteMutation.mutate(pub.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!isAllowed) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Restricted</h2>
        <p className="text-muted-foreground text-sm">Only super admins or content managers can manage publications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publications & Blog</h1>
          <p className="text-muted-foreground">Manage articles and external media with rich content.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <DialogHeader>
              <DialogTitle>Create Publication</DialogTitle>
            </DialogHeader>
            <form className="flex flex-col gap-4 flex-1 min-h-0" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2 pb-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={createForm.type}
                  onValueChange={(value) => setCreateForm((prev) => ({ ...prev, type: value as PublicationType }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="media">Media / External</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={createForm.author}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Education"
                    value={createForm.category}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, category: e.target.value }))}
                    required
                  />
                </div>
                </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Publication Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={createForm.published_on}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, published_on: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCreateCover(e.target.files?.[0] ?? null)}
                  />
                  {createCover && <p className="text-xs text-muted-foreground">Selected: {createCover.name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="external">External Link (optional)</Label>
                <Input
                  id="external"
                  placeholder="https://..."
                  value={createForm.external_url}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, external_url: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={createForm.content}
                  onChange={(value) => setCreateForm((prev) => ({ ...prev, content: value }))}
                  placeholder="Write a summary or full article..."
                />
                </div>
              </div>

              <div className="flex gap-3 pt-4 mt-auto border-t border-border bg-card">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCreateSubmit("draft")}
                  disabled={createMutation.isPending}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleCreateSubmit("published")}
                  disabled={createMutation.isPending}
                >
                  Publish
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
            placeholder="Search publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading publications...</p>}
      {isError && <p className="text-destructive">Failed to load publications.</p>}
      {!isLoading && filteredPublications.length === 0 && <p className="text-muted-foreground">No publications found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPublications.map(renderCard)}
                </div>

      <Dialog open={!!previewContent} onOpenChange={(open) => !open && setPreviewContent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewContent?.title ?? "Preview"}</DialogTitle>
          </DialogHeader>
          {previewContent && (
            <div className="space-y-3 overflow-y-auto pr-2 pb-2 max-h-[68vh]">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {previewContent.type}
                </Badge>
                {previewContent.category && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {previewContent.category}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {previewContent.author} • {new Date(previewContent.published_on).toLocaleDateString()}
              </p>
              <RichTextContent html={previewContent.content} />
              {previewContent.external_url && (
                <Button asChild variant="link" className="p-0">
                  <a href={previewContent.external_url} target="_blank" rel="noreferrer">
                    Open external link <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Publication</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4 flex-1 min-h-0" onSubmit={(e) => e.preventDefault()}>
            <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pr-2 pb-2">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, type: value as PublicationType }))}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="media">Media / External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
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
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={editForm.author}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, author: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  placeholder="e.g. Education"
                  value={editForm.category}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Publication Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.published_on}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, published_on: e.target.value }))}
                  required
                />
                </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cover">Cover Image</Label>
                <Input
                  id="edit-cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditCover(e.target.files?.[0] ?? null)}
                />
                {(editCover || editForm.cover_image_url) && (
                  <p className="text-xs text-muted-foreground">
                    {editCover ? `Selected: ${editCover.name}` : `Current: ${editForm.cover_image_url}`}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-external">External Link (optional)</Label>
              <Input
                id="edit-external"
                placeholder="https://..."
                value={editForm.external_url}
                onChange={(e) => setEditForm((prev) => ({ ...prev, external_url: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                value={editForm.content}
                onChange={(value) => setEditForm((prev) => ({ ...prev, content: value }))}
                placeholder="Write a summary or full article..."
              />
              </div>
            </div>

            <div className="flex gap-3 pt-4 mt-auto border-t border-border bg-card">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleUpdateSubmit("draft")}
                disabled={updateMutation.isPending || !editingPublication}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleUpdateSubmit("published")}
                disabled={updateMutation.isPending || !editingPublication}
              >
                Publish
              </Button>
      </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicationsManagement;
