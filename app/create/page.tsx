"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userId) throw new Error("User not authenticated");

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
      });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Error creating article. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Add your logo here */}
            <span className="text-2xl font-bold text-gray-900">YourLogo</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              form="create-article-form"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium transition duration-150 ease-in-out"
            >
              Publish
            </button>
            <button className="text-gray-500 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <form id="create-article-form" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full text-4xl font-bold focus:outline-none placeholder-gray-300"
            />
          </div>
          <div className="prose max-w-none">
            <MdEditor
              style={{ height: '500px' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: false
                }
              }}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setImage(e.target.files ? e.target.files[0] : null)
                  }
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                />
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Audio
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAudio(e.target.files ? e.target.files[0] : null)
                  }
                  className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                />
              </label>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}