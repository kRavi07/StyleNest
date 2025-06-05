"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    featuredImage: "",
    seo: {
      title: "",
      description: "",
      keywords: ""
    }
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Page created",
        description: "Your new page has been created successfully.",
      });
      router.push("/content");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Page</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Icons.check className="mr-2 h-4 w-4" />
                Create Page
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Create your page content and upload media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  placeholder="Enter page title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input
                  value={pageData.slug}
                  onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                  placeholder="enter-url-slug"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={pageData.description}
                  onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                  placeholder="Enter page description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={pageData.content}
                  onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
                  placeholder="Enter page content"
                  className="min-h-[200px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Featured Image</label>
                <div className="flex gap-2">
                  <Input
                    value={pageData.featuredImage}
                    onChange={(e) => setPageData({ ...pageData, featuredImage: e.target.value })}
                    placeholder="Enter image URL"
                  />
                  <Button variant="outline">
                    <Icons.image className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your page for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">SEO Title</label>
                <Input
                  value={pageData.seo.title}
                  onChange={(e) => setPageData({ 
                    ...pageData, 
                    seo: { ...pageData.seo, title: e.target.value }
                  })}
                  placeholder="Enter SEO title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  value={pageData.seo.description}
                  onChange={(e) => setPageData({ 
                    ...pageData, 
                    seo: { ...pageData.seo, description: e.target.value }
                  })}
                  placeholder="Enter meta description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Keywords</label>
                <Input
                  value={pageData.seo.keywords}
                  onChange={(e) => setPageData({ 
                    ...pageData, 
                    seo: { ...pageData.seo, keywords: e.target.value }
                  })}
                  placeholder="Enter keywords, separated by commas"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Page Preview</CardTitle>
              <CardDescription>
                Preview how your page will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {pageData.featuredImage && (
                  <img 
                    src={pageData.featuredImage} 
                    alt={pageData.title}
                    className="w-full h-[300px] object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-3xl font-bold mb-4">{pageData.title}</h1>
                <p className="text-muted-foreground mb-6">{pageData.description}</p>
                <div className="whitespace-pre-wrap">{pageData.content}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}