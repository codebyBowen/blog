"use client";

import { useState, FormEvent,useEffect, ChangeEvent } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import TopBar from "../../components/TopBar";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

      const { data, error } = await supabase.from("articles").insert({
        title,
        content,
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="Title"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setContent(e.target.value)
          }
          placeholder="Content"
          required
          className="w-full p-2 border rounded h-40"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setImage(e.target.files ? e.target.files[0] : null)
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="audio/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAudio(e.target.files ? e.target.files[0] : null)
          }
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
