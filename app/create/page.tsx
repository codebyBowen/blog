"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import TopBar from "@/components/TopBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';

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
  const [userId, setUserId] = useState<string | null>(null);
  const [tag, setTag] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setContent(html);
    setMarkdownContent(text);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileName = `${uuidv4()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${fileName}`, file);
      
      if (error) throw error;
      
      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) throw new Error("User not authenticated");
      if (!tag) throw new Error("Please select a tag");

      let imagePath = null;
      let audioPath = null;

      if (image) {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(`public/${Date.now()}_${image.name}`, image);
        if (error) throw error;
        imagePath = data.path;
      }

      if (audio) {
        const { data, error } = await supabase.storage
          .from("audio")
          .upload(`public/${Date.now()}_${audio.name}`, audio);
        if (error) throw error;
        audioPath = data.path;
      }

      const { error } = await supabase.from("articles").insert({
        title,
        content,
        markdown_content: markdownContent,
        image_url: imagePath,
        audio_url: audioPath,
        user_id: userId,
        tag: tag,
      });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Error creating article. Please try again.");
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    Publish
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