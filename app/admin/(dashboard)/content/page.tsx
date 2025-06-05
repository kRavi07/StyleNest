"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentData, getContent } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ContentPage() {
  const [content] = useState<ContentData[]>(getContent());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = content.filter((item) => {
    return item.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/content/pages/new">
              <Icons.fileText className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
          <Button asChild>
            <Link href="/content/blog/new">
              <Icons.fileText className="mr-2 h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Content</CardTitle>
          <CardDescription>
            Manage all content including pages, blog posts, and navigation menus.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-72">
                <Icons.search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search content..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No content found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{item.title}</span>
                              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {item.slug}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.author}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(item.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "published"
                                  ? "default"
                                  : item.status === "draft"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Icons.ellipsis className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Icons.view className="mr-2 h-4 w-4" />
                                  <span>Preview</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Icons.edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {item.status === "published" ? (
                                  <DropdownMenuItem>
                                    <Icons.panel className="mr-2 h-4 w-4" />
                                    <span>Unpublish</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <Icons.check className="mr-2 h-4 w-4" />
                                    <span>Publish</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Icons.copy className="mr-2 h-4 w-4" />
                                  <span>Duplicate</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Icons.trash className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pages" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.type === "page").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No pages found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent
                        .filter(item => item.type === "page")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{item.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {item.slug}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {item.author}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(item.updatedAt)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "published"
                                    ? "default"
                                    : item.status === "draft"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Icons.ellipsis className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Icons.view className="mr-2 h-4 w-4" />
                                    <span>Preview</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Icons.edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {item.status === "published" ? (
                                    <DropdownMenuItem>
                                      <Icons.panel className="mr-2 h-4 w-4" />
                                      <span>Unpublish</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      <Icons.check className="mr-2 h-4 w-4" />
                                      <span>Publish</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Icons.copy className="mr-2 h-4 w-4" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Icons.trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="blog" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Author</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.type === "blog").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No blog posts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent
                        .filter(item => item.type === "blog")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{item.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {item.slug}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {item.author}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(item.updatedAt)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "published"
                                    ? "default"
                                    : item.status === "draft"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Icons.ellipsis className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Icons.view className="mr-2 h-4 w-4" />
                                    <span>Preview</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Icons.edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {item.status === "published" ? (
                                    <DropdownMenuItem>
                                      <Icons.panel className="mr-2 h-4 w-4" />
                                      <span>Unpublish</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      <Icons.check className="mr-2 h-4 w-4" />
                                      <span>Publish</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Icons.copy className="mr-2 h-4 w-4" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Icons.trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="navigation" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContent.filter(item => item.type === "navigation").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No navigation menus found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContent
                        .filter(item => item.type === "navigation")
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{item.title}</span>
                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {item.description || "Navigation menu"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(item.updatedAt)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "published"
                                    ? "default"
                                    : item.status === "draft"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Icons.ellipsis className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Icons.edit className="mr-2 h-4 w-4" />
                                    <span>Edit menu</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {item.status === "published" ? (
                                    <DropdownMenuItem>
                                      <Icons.panel className="mr-2 h-4 w-4" />
                                      <span>Unpublish</span>
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      <Icons.check className="mr-2 h-4 w-4" />
                                      <span>Publish</span>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Icons.copy className="mr-2 h-4 w-4" />
                                    <span>Duplicate</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}