import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Save } from "lucide-react";

const Settings = () => {
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
                  <Input id="site-name" defaultValue="HEAL Pakistan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input id="slogan" defaultValue="Reach the Unreached" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
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
                  <Input id="email" type="email" placeholder="info@healpakistan.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+92 xxx xxxxxxx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter organization address" />
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
                  <Input id="facebook" placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize the main banner on homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Background Image/Video</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload hero background (image or video)</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input id="hero-title" defaultValue="HEAL Pakistan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Input id="hero-subtitle" defaultValue="Reach the Unreached" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-button">Button Text</Label>
                <Input id="hero-button" defaultValue="Learn More" />
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
                <Label htmlFor="about-intro">Introduction (Homepage Preview)</Label>
                <Textarea
                  id="about-intro"
                  rows={3}
                  defaultValue="At HEAL Pakistan, we inspire humanity and foster healing through our initiative to reach the unreached."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  rows={4}
                  defaultValue="At HEAL Pakistan, we inspire humanity and foster healing through our initiative to reach the unreached. We empower the youth with education and awareness, cultivating a compassionate generation dedicated to uplifting communities across our nation."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vision">Vision Statement</Label>
                <Textarea id="vision" rows={3} placeholder="Enter vision statement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Objectives</Label>
                <Textarea id="objectives" rows={4} placeholder="Enter organization objectives" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Programs</CardTitle>
              <CardDescription>Manage the four program pillars</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {["Humanity", "Education Empowerment", "Awareness", "Leadership"].map((program) => (
                <div key={program} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{program}</h3>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">Change Icon</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder={`Enter ${program} description`} rows={2} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
