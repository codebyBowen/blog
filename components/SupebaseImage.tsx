"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const extractImagePath = (url: string): string => {
  const match = url.match(/public\/([\w-]+_[\w.]+)/);
  if (match) {
    return `public/${match[1]}`;
  }
  return url;
};

export default function SupabaseImage({
  src,
  alt,
}: {
  src: string;
  alt?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // if (src.startsWith("public/")) {

    // }
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(
        `${extractImagePath(src)}`
      );
    console.log("data", data?.publicUrl, "src", extractImagePath(src));

    setImageSrc(data?.publicUrl);
  }, [src]);

  return (
    <div className="my-4">
      <img
        src={imageSrc}
        alt={alt || ""}
        className="max-w-full h-auto rounded-lg mx-auto"
        loading="lazy"
      />
    </div>
  );
}
