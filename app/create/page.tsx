"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArticleVisibility } from "@/types/article";

// Dynamically import Markdown editor to avoid server-side rendering issues
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

const mdParser = new MarkdownIt();

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [tag, setTag] = useState<string>("");
  const [visibility, setVisibility] = useState<ArticleVisibility>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setContent(html);
    setMarkdownContent(text);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // 防止重复提交

    try {
      setIsSubmitting(true);

      // 验证必填字段
      if (!title.trim()) throw new Error("Please enter a title");
      if (!content.trim()) throw new Error("Please enter content");
      if (!tag) throw new Error("Please select a tag");

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('markdown_content', markdownContent);
      formData.append('tag', tag);
      formData.append('visibility', visibility);
      if (image) formData.append('image', image);
      if (audio) formData.append('audio', audio);

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create article');
      }

      router.push("/");
    } catch (error) {
      console.error("Error creating article:", error);
      const errorMessage = error instanceof Error ? error.message : "Error creating article. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <main className="flex-grow bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <input
                type="text"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="w-full text-4xl font-bold focus:outline-none placeholder-muted-foreground bg-transparent"
              />
            </CardHeader>
            <CardContent>
              <form id="create-article-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="prose max-w-none dark:prose-invert">
                  <MdEditor
                    style={{ height: '500px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                    onImageUpload={async (file: File) => {
                      const url = await handleImageUpload(file);
                      return url;
                    }}
                    config={{
                      view: {
                        menu: true,
                        md: true,
                        html: false
                      },
                      imageAccept: '.jpg,.jpeg,.png,.gif'
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setImage(e.target.files ? e.target.files[0] : null)
                        }
                        className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-primary-foreground
                                  hover:file:bg-primary/90"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Audio
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setAudio(e.target.files ? e.target.files[0] : null)
                        }
                        className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-primary-foreground
                                  hover:file:bg-primary/90"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tag
                      <Select onValueChange={setTag} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="SEO">SEO</SelectItem>
                          <SelectItem value="Life Experience">Life Experience</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Visibility
                      <Select onValueChange={(value) => setVisibility(value as ArticleVisibility)} defaultValue="public">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}