import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchSiteSettings, upsertSiteSettings, uploadSiteLogo } from "@/api/settings";
import { listHeroSlides, createHeroSlide, deleteHeroSlide, uploadHeroMedia, HeroMediaType } from "@/api/hero";
import {
  createProgram,
  deleteProgram,
  listPrograms,
  reorderPrograms,
  updateProgram,
  uploadProgramImage,
} from "@/api/programs";
import { Program } from "@/types/programs";
import { SiteSettings } from "@/types/settings";

type ProgramFormState = {
  title: string;
  summary: string;
  image_url: string;
  key_activities: string[];
  is_published: boolean;
};

const emptyProgramForm: ProgramFormState = {
  title: "",
  summary: "",
  image_url: "",
  key_activities: [""],
  is_published: true,
};

const normalizeActivities = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter((item, index, all) => item.length > 0 && all.indexOf(item) === index);

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
  });

  const [form, setForm] = useState<Partial<SiteSettings>>({
    site_name: "",
    slogan: "",
    logo_url: "",
    hero_title: "",
    hero_subtitle: "",
    hero_text: "",
    about_intro: "",
    about_mission: "",
    about_vision: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    social_facebook: "",
    social_instagram: "",
    social_twitter: "",
    social_linkedin: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newSlideFile, setNewSlideFile] = useState<File | null>(null);
  const [newSlidePreview, setNewSlidePreview] = useState<string | null>(null);
  const { data: heroSlides } = useQuery({ queryKey: ["hero-slides"], queryFn: listHeroSlides });
  const { data: programs, isLoading: isProgramsLoading } = useQuery({ queryKey: ["programs"], queryFn: listPrograms });
  const orderedPrograms = useMemo(
    () =>
      [...(programs ?? [])].sort((a, b) => {
        if (a.sort_order === b.sort_order) return a.created_at.localeCompare(b.created_at);
        return a.sort_order - b.sort_order;
      }),
    [programs]
  );

  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [programCreateForm, setProgramCreateForm] = useState<ProgramFormState>(emptyProgramForm);
  const [programEditForm, setProgramEditForm] = useState<ProgramFormState>(emptyProgramForm);
  const [createProgramFile, setCreateProgramFile] = useState<File | null>(null);
  const [editProgramFile, setEditProgramFile] = useState<File | null>(null);
  const [createProgramPreview, setCreateProgramPreview] = useState<string | null>(null);
  const [editProgramPreview, setEditProgramPreview] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const createSlideMutation = useMutation({
    mutationFn: async () => {
      if (!newSlideFile) return;
      const mediaType: HeroMediaType = newSlideFile.type.startsWith("video") ? "video" : "image";
      const mediaUrl = await uploadHeroMedia(newSlideFile);
      await createHeroSlide({ media_url: mediaUrl, media_type: mediaType });
    },
    onSuccess: () => {
      toast({ title: "Hero slide added", description: "Slide is live on homepage." });
      setNewSlideFile(null);
      setNewSlidePreview(null);
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: () => {
      toast({ title: "Slide removed", description: "It will no longer show on the hero." });
      queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const resetCreateProgramForm = () => {
    if (createProgramPreview) {
      URL.revokeObjectURL(createProgramPreview);
    }
    setProgramCreateForm(emptyProgramForm);
    setCreateProgramFile(null);
    setCreateProgramPreview(null);
  };

  const resetEditProgramState = () => {
    if (editProgramPreview) {
      URL.revokeObjectURL(editProgramPreview);
    }
    setProgramEditForm(emptyProgramForm);
    setEditProgramFile(null);
    setEditProgramPreview(null);
    setEditingProgram(null);
  };

  const handleEditProgramOpen = (program: Program) => {
    setEditingProgram(program);
    setProgramEditForm({
      title: program.title,
      summary: program.summary ?? "",
      image_url: program.image_url ?? "",
      key_activities: program.key_activities?.length ? program.key_activities : [""],
      is_published: program.is_published,
    });
    setEditProgramPreview(null);
    setEditProgramFile(null);
    setIsEditProgramOpen(true);
  };

  const createProgramMutation = useMutation({
    mutationFn: async () => {
      const imageUrl = createProgramFile
        ? await uploadProgramImage(createProgramFile)
        : programCreateForm.image_url.trim()
          ? programCreateForm.image_url.trim()
          : null;

      return createProgram({
        title: programCreateForm.title,
        summary: programCreateForm.summary,
        image_url: imageUrl,
        key_activities: normalizeActivities(programCreateForm.key_activities),
        is_published: programCreateForm.is_published,
        sort_order: orderedPrograms.length,
      });
    },
    onSuccess: () => {
      toast({ title: "Program added", description: "Program is now live." });
      resetCreateProgramForm();
      setIsCreateProgramOpen(false);
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add program",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const imageUrl = editProgramFile
        ? await uploadProgramImage(editProgramFile)
        : programEditForm.image_url.trim()
          ? programEditForm.image_url.trim()
          : null;

      return updateProgram(id, {
        title: programEditForm.title,
        summary: programEditForm.summary,
        image_url: imageUrl,
        key_activities: normalizeActivities(programEditForm.key_activities),
        is_published: programEditForm.is_published,
      });
    },
    onSuccess: () => {
      toast({ title: "Program updated", description: "Changes saved successfully." });
      resetEditProgramState();
      setIsEditProgramOpen(false);
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update program",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      toast({ title: "Program deleted", description: "Removed from listings." });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to delete program",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const reorderProgramsMutation = useMutation({
    mutationFn: (order: { id: string; sort_order: number }[]) => reorderPrograms(order),
    onSuccess: () => {
      toast({ title: "Order updated", description: "Programs reordered successfully." });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to reorder programs",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      updateProgram(id, { is_published }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update visibility",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const handleMoveProgram = (id: string, direction: "up" | "down") => {
    if (!orderedPrograms.length || reorderProgramsMutation.isPending) return;
    const currentIndex = orderedPrograms.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= orderedPrograms.length) return;

    const nextOrder = [...orderedPrograms];
    const [removed] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(targetIndex, 0, removed);

    reorderProgramsMutation.mutate(nextOrder.map((item, index) => ({ id: item.id, sort_order: index })));
  };

  const handleDeleteProgram = (id: string) => {
    const confirmDelete = window.confirm("Delete this program? This cannot be undone.");
    if (!confirmDelete) return;
    deleteProgramMutation.mutate(id);
  };

  const addActivityField = (mode: "create" | "edit") => {
    if (mode === "create") {
      setProgramCreateForm((prev) => ({ ...prev, key_activities: [...prev.key_activities, ""] }));
    } else {
      setProgramEditForm((prev) => ({ ...prev, key_activities: [...prev.key_activities, ""] }));
    }
  };

  const updateActivityField = (mode: "create" | "edit", index: number, value: string) => {
    if (mode === "create") {
      setProgramCreateForm((prev) => {
        const next = [...prev.key_activities];
        next[index] = value;
        return { ...prev, key_activities: next };
      });
    } else {
      setProgramEditForm((prev) => {
        const next = [...prev.key_activities];
        next[index] = value;
        return { ...prev, key_activities: next };
      });
    }
  };

  const removeActivityField = (mode: "create" | "edit", index: number) => {
    if (mode === "create") {
      setProgramCreateForm((prev) => {
        if (prev.key_activities.length === 1) return prev;
        const next = [...prev.key_activities];
        next.splice(index, 1);
        return { ...prev, key_activities: next };
      });
    } else {
      setProgramEditForm((prev) => {
        if (prev.key_activities.length === 1) return prev;
        const next = [...prev.key_activities];
        next.splice(index, 1);
        return { ...prev, key_activities: next };
      });
    }
  };

  const handleProgramImageChange = (file: File | null, mode: "create" | "edit") => {
    if (mode === "create") {
      if (createProgramPreview) URL.revokeObjectURL(createProgramPreview);
      setCreateProgramFile(file);
      setCreateProgramPreview(file ? URL.createObjectURL(file) : null);
    } else {
      if (editProgramPreview) URL.revokeObjectURL(editProgramPreview);
      setEditProgramFile(file);
      setEditProgramPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  useEffect(() => {
    if (!settings) return;
    setForm({
      site_name: settings.site_name,
      slogan: settings.slogan ?? "",
      logo_url: settings.logo_url ?? "",
      hero_title: settings.hero_title ?? "",
      hero_subtitle: settings.hero_subtitle ?? "",
      hero_text: settings.hero_text ?? "",
      about_intro: settings.about_intro ?? "",
      about_mission: settings.about_mission ?? "",
      about_vision: settings.about_vision ?? "",
      contact_email: settings.contact_email ?? "",
      contact_phone: settings.contact_phone ?? "",
      contact_address: settings.contact_address ?? "",
      social_facebook: settings.social_facebook ?? "",
      social_instagram: settings.social_instagram ?? "",
      social_twitter: settings.social_twitter ?? "",
      social_linkedin: settings.social_linkedin ?? "",
    });
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      let logoUrl = form.logo_url;
      if (logoFile) {
        logoUrl = await uploadSiteLogo(logoFile);
      }
      const saved = await upsertSiteSettings({
        ...form,
        logo_url: logoUrl,
      });
      return saved;
    },
    onSuccess: (saved) => {
      toast({ title: "Settings saved", description: "Your changes are live." });
      setLogoFile(null);
      // Keep form in sync with saved values so fields do not reset
      setForm({
        site_name: saved.site_name,
        slogan: saved.slogan ?? "",
        logo_url: saved.logo_url ?? "",
        hero_title: saved.hero_title ?? "",
        hero_subtitle: saved.hero_subtitle ?? "",
        hero_text: saved.hero_text ?? "",
        about_intro: saved.about_intro ?? "",
        about_mission: saved.about_mission ?? "",
        about_vision: saved.about_vision ?? "",
        contact_email: saved.contact_email ?? "",
        contact_phone: saved.contact_phone ?? "",
        contact_address: saved.contact_address ?? "",
        social_facebook: saved.social_facebook ?? "",
        social_instagram: saved.social_instagram ?? "",
        social_twitter: saved.social_twitter ?? "",
        social_linkedin: saved.social_linkedin ?? "",
      });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unexpected error",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage website settings and content</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic website information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Organization Name</Label>
                  <Input
                    id="site-name"
                    value={form.site_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, site_name: e.target.value }))}
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    value={form.slogan}
                    onChange={(e) => setForm((prev) => ({ ...prev, slogan: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                    {logoFile ? (
                      <img src={URL.createObjectURL(logoFile)} alt="Logo preview" className="w-full h-full object-contain" />
                    ) : form.logo_url ? (
                      <img src={form.logo_url} alt="Current logo" className="w-full h-full object-contain" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Organization contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@healpakistan.org"
                    value={form.contact_email}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact_email: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+92 xxx xxxxxxx"
                    value={form.contact_phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter organization address"
                  value={form.contact_address}
                  onChange={(e) => setForm((prev) => ({ ...prev, contact_address: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/..."
                    value={form.social_facebook}
                    onChange={(e) => setForm((prev) => ({ ...prev, social_facebook: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/..."
                    value={form.social_instagram}
                    onChange={(e) => setForm((prev) => ({ ...prev, social_instagram: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    value={form.social_twitter}
                    onChange={(e) => setForm((prev) => ({ ...prev, social_twitter: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/..."
                    value={form.social_linkedin}
                    onChange={(e) => setForm((prev) => ({ ...prev, social_linkedin: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Titles and text shown on the homepage hero</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={form.hero_title ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_title: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={form.hero_subtitle ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_subtitle: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-text">Hero Text</Label>
                <Textarea
                  id="hero-text"
                  rows={4}
                  value={form.hero_text ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, hero_text: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Supporting text that appears under the title/subtitle."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Media Slider</CardTitle>
              <CardDescription>Add images or videos; they will rotate on the homepage hero.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {heroSlides?.map((slide) => (
                  <div key={slide.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                      {slide.media_type === "video" ? (
                        <video src={slide.media_url} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={slide.media_url} alt="Hero media" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="capitalize">{slide.media_type}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => deleteSlideMutation.mutate(slide.id)}
                        disabled={deleteSlideMutation.isPending}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-3">
                  <div className="w-full">
                    <Label htmlFor="hero-media">Add Image or Video</Label>
                    <Input
                      id="hero-media"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setNewSlideFile(file);
                        setNewSlidePreview(file ? URL.createObjectURL(file) : null);
                      }}
                      disabled={createSlideMutation.isPending}
                    />
                  </div>
                  {newSlidePreview && (
                    <div className="w-full">
                      <p className="text-xs text-muted-foreground mb-1">Preview</p>
                      <div className="aspect-video rounded-md overflow-hidden bg-muted">
                        {newSlideFile?.type.startsWith("video") ? (
                          <video src={newSlidePreview} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={newSlidePreview} alt="Preview" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => createSlideMutation.mutate()}
                    disabled={!newSlideFile || createSlideMutation.isPending}
                  >
                    {createSlideMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Upload Slide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us Content</CardTitle>
              <CardDescription>Edit the About Us page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-intro">Introduction (Homepage "Who We Are")</Label>
                <Textarea
                  id="about-intro"
                  rows={3}
                  value={form.about_intro ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, about_intro: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Short intro shown beneath About Us on the homepage."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement (About page)</Label>
                <Textarea
                  id="mission"
                  rows={4}
                  value={form.about_mission ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, about_mission: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Mission text displayed on the About page."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement (About page)</Label>
                <Textarea
                  id="vision"
                  rows={3}
                  value={form.about_vision ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, about_vision: e.target.value }))}
                  disabled={isLoading}
                  placeholder="Vision text displayed on the About page."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="mt-6 space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Programs</CardTitle>
                <CardDescription>Control homepage and programs page content.</CardDescription>
              </div>
              <Dialog
                open={isCreateProgramOpen}
                onOpenChange={(open) => {
                  setIsCreateProgramOpen(open);
                  if (!open) resetCreateProgramForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add program</DialogTitle>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      createProgramMutation.mutate();
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="program-title">Title</Label>
                      <Input
                        id="program-title"
                        value={programCreateForm.title}
                        onChange={(e) => setProgramCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Program name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="program-summary">Summary (subtle text)</Label>
                      <Textarea
                        id="program-summary"
                        rows={3}
                        value={programCreateForm.summary}
                        onChange={(e) => setProgramCreateForm((prev) => ({ ...prev, summary: e.target.value }))}
                        placeholder="One or two sentences shown with the program."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover image</Label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="h-28 w-full sm:w-44 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                          {createProgramPreview || programCreateForm.image_url ? (
                            <img
                              src={createProgramPreview ?? programCreateForm.image_url}
                              alt="Program preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">Upload a wide image</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProgramImageChange(e.target.files?.[0] ?? null, "create")}
                          />
                          <Input
                            placeholder="Or paste an image URL"
                            value={programCreateForm.image_url}
                            onChange={(e) => setProgramCreateForm((prev) => ({ ...prev, image_url: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Key activities</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addActivityField("create")}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {programCreateForm.key_activities.map((activity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={activity}
                              onChange={(e) => updateActivityField("create", index, e.target.value)}
                              placeholder="e.g., Food distribution drives"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeActivityField("create", index)}
                              disabled={programCreateForm.key_activities.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium">Publish</p>
                        <p className="text-sm text-muted-foreground">Show on homepage and programs page</p>
                      </div>
                      <Switch
                        checked={programCreateForm.is_published}
                        onCheckedChange={(value) => setProgramCreateForm((prev) => ({ ...prev, is_published: value }))}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetCreateProgramForm();
                          setIsCreateProgramOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createProgramMutation.isPending || !programCreateForm.title.trim()}>
                        {createProgramMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Program
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {isProgramsLoading ? (
                <p className="text-muted-foreground text-sm">Loading programs...</p>
              ) : orderedPrograms.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-muted-foreground">No programs yet. Add one to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderedPrograms.map((program, index) => (
                    <div key={program.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col gap-4 md:flex-row">
                        <div className="md:w-1/3">
                          <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                            {program.image_url ? (
                              <img
                                src={program.image_url}
                                alt={program.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                No image yet
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-lg font-semibold">{program.title}</h3>
                                <Badge variant={program.is_published ? "default" : "secondary"}>
                                  {program.is_published ? "Published" : "Hidden"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Order {index + 1}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {program.summary || "No summary added yet."}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveProgram(program.id, "up")}
                                disabled={index === 0 || reorderProgramsMutation.isPending}
                                title="Move up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMoveProgram(program.id, "down")}
                                disabled={index === orderedPrograms.length - 1 || reorderProgramsMutation.isPending}
                                title="Move down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium text-sm">Key activities</p>
                            {program.key_activities?.length ? (
                              <ul className="grid gap-1 sm:grid-cols-2">
                                {program.key_activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">No activities listed.</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                togglePublishMutation.mutate({ id: program.id, is_published: !program.is_published })
                              }
                            >
                              {program.is_published ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Hide
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => handleEditProgramOpen(program)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProgram(program.id)}
                              disabled={deleteProgramMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog
            open={isEditProgramOpen}
            onOpenChange={(open) => {
              setIsEditProgramOpen(open);
              if (!open) resetEditProgramState();
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit program</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editingProgram) return;
                  updateProgramMutation.mutate({ id: editingProgram.id });
                }}
              >
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={programEditForm.title}
                    onChange={(e) => setProgramEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Summary (subtle text)</Label>
                  <Textarea
                    rows={3}
                    value={programEditForm.summary}
                    onChange={(e) => setProgramEditForm((prev) => ({ ...prev, summary: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cover image</Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="h-28 w-full sm:w-44 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                      {editProgramPreview || programEditForm.image_url ? (
                        <img
                          src={editProgramPreview ?? programEditForm.image_url}
                          alt="Program preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">Upload a wide image</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProgramImageChange(e.target.files?.[0] ?? null, "edit")}
                      />
                      <Input
                        placeholder="Or paste an image URL"
                        value={programEditForm.image_url}
                        onChange={(e) => setProgramEditForm((prev) => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Key activities</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addActivityField("edit")}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {programEditForm.key_activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={activity}
                          onChange={(e) => updateActivityField("edit", index, e.target.value)}
                          placeholder="e.g., Career counseling workshops"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeActivityField("edit", index)}
                          disabled={programEditForm.key_activities.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">Publish</p>
                    <p className="text-sm text-muted-foreground">Show on homepage and programs page</p>
                  </div>
                  <Switch
                    checked={programEditForm.is_published}
                    onCheckedChange={(value) => setProgramEditForm((prev) => ({ ...prev, is_published: value }))}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetEditProgramState();
                      setIsEditProgramOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateProgramMutation.isPending || !programEditForm.title.trim()}>
                    {updateProgramMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={mutation.isPending || isLoading}>
          {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
