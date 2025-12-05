import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Pencil, Trash2, Upload, Eye, FileText, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPublications = [
  { id: 1, title: "HEAL Pakistan's Impact on Youth Education", type: "article", date: "2024-02-15", status: "published", image: "/placeholder.svg" },
  { id: 2, title: "Media Coverage - Dawn News", type: "media", date: "2024-02-10", status: "published", image: "/placeholder.svg" },
  { id: 3, title: "Leadership Development Program Results", type: "article", date: "2024-01-28", status: "draft", image: "/placeholder.svg" },
  { id: 4, title: "Express Tribune Feature", type: "media", date: "2024-01-15", status: "published", image: "/placeholder.svg" },
];

const PublicationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [publicationType, setPublicationType] = useState("article");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publications & Blog</h1>
          <p className="text-muted-foreground">Manage articles and media coverage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Publication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Publication</DialogTitle>
            </DialogHeader>
            <Tabs value={publicationType} onValueChange={setPublicationType}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="article">
                  <FileText className="h-4 w-4 mr-2" />
                  Article
                </TabsTrigger>
                <TabsTrigger value="media">
                  <Image className="h-4 w-4 mr-2" />
                  Media Screenshot
                </TabsTrigger>
              </TabsList>
              <TabsContent value="article" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload featured image</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-title">Title</Label>
                  <Input id="article-title" placeholder="Enter article title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="article-content">Content</Label>
                  <Textarea id="article-content" placeholder="Write your article content here..." rows={8} />
                  <p className="text-xs text-muted-foreground">Supports rich text formatting</p>
                </div>
              </TabsContent>
              <TabsContent value="media" className="space-y-4 mt-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload media coverage screenshot</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-title">Title / Source</Label>
                  <Input id="media-title" placeholder="e.g., Dawn News Feature" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media-link">Source Link (optional)</Label>
                  <Input id="media-link" placeholder="https://..." />
                </div>
              </TabsContent>
            </Tabs>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline" className="flex-1">Save as Draft</Button>
              <Button className="flex-1">Publish</Button>
            </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPublications.map((pub) => (
          <Card key={pub.id}>
            <CardContent className="p-0">
              <img src={pub.image} alt={pub.title} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {pub.type === "article" ? <FileText className="h-3 w-3 mr-1" /> : <Image className="h-3 w-3 mr-1" />}
                    {pub.type}
                  </Badge>
                  <Badge variant={pub.status === "published" ? "default" : "secondary"}>
                    {pub.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{pub.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{pub.date}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
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
        ))}
      </div>
    </div>
  );
};

export default PublicationsManagement;
