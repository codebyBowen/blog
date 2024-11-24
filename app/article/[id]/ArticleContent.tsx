"use client";

import React from "react";
import { Article } from "../../../types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Components } from "react-markdown";
import Image from "@/components/Image";
import readingDuration from "reading-duration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faThumbsUp as fasThumbsUp,
  faThumbsDown as fasThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as farThumbsUp,
  faThumbsDown as farThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import { CopyBlock, dracula } from "react-code-blocks";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// import NextImage from 'next/image';
import SupabaseImage from "@/components/SupebaseImage";

const slugify = (text: string | React.ReactNode): string => {
  const str =
    typeof text === "string"
      ? text
      : Array.isArray(text)
      ? text.join("")
      : String(text);

  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function ArticleContent({
  article,
  user,
}: {
  article: Article;
  user: any;
}) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [thumbsUp, setThumbsUp] = useState(article.thumbs_up || 0);
  const [thumbsDown, setThumbsDown] = useState(article.thumbs_down || 0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // 从 localStorage 加载用户投票状态
    const savedVote = localStorage.getItem(`vote-${article.id}`);
    if (savedVote) {
      setUserVote(savedVote as "up" | "down");
    }
  }, [article.id]);

  const handleVote = async (voteType: "up" | "down") => {
    console.log("Vote clicked:", voteType);

    const isRemovingVote = userVote === voteType;
    const column = voteType === "up" ? "thumbup" : "thumbdown";

    try {
      const supabase = createClientComponentClient();

      // 更新投票状态
      setUserVote(isRemovingVote ? null : voteType);

      // 更新 localStorage
      if (isRemovingVote) {
        localStorage.removeItem(`vote-${article.id}`);
      } else {
        localStorage.setItem(`vote-${article.id}`, voteType);
      }

      // 更新数据库
      const { data: currentArticle, error: fetchError } = await supabase
        .from("articles")
        .select("thumbup, thumbdown")
        .eq("id", article.id)
        .single();

      if (fetchError) {
        console.error("Error fetching article:", fetchError);
        return;
      }

      const currentValue = (currentArticle as any)[column] || 0;
      const newValue = Math.max(
        0,
        isRemovingVote ? currentValue - 1 : currentValue + 1
      );

      const { data: updatedArticle, error } = await supabase
        .from("articles")
        .update({ [column]: newValue })
        .eq("id", article.id)
        .select("thumbup, thumbdown")
        .single();

      if (error) {
        console.error("Error updating vote:", error);
        return;
      }

      // 使用数据库返回的最新数据更新状态
      if (updatedArticle) {
        setThumbsUp(updatedArticle.thumbup || 0);
        setThumbsDown(updatedArticle.thumbdown || 0);
      }
    } catch (error) {
      console.error("Error in vote handling:", error);
    }
  };

  const customRenderers: Partial<Components> = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      if (!inline && match) {
        return (
          <div className="dark">
            <CopyBlock
              text={String(children).replace(/\n$/, "")}
              language={language}
              showLineNumbers={true}
              theme={dracula}
              codeBlock
            />
          </div>
        );
      }

      return (
        <code
          className={`${className} px-1 rounded [&]:dark:text-white [&]:dark:bg-gray-800`}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 id={slugify(children)} className="scroll-mt-16">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 id={slugify(children)} className="scroll-mt-16">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 id={slugify(children)} className="scroll-mt-16">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 id={slugify(children)} className="scroll-mt-16">
        {children}
      </h4>
    ),
    img({ src, alt }) {
      if (!src) return null;
      return (
        <div className="my-4">
          <img
            src={src}
            alt={alt || ""}
            className="max-w-full h-auto rounded-lg mx-auto"
            loading="lazy"
          />
        </div>
      );
    },
  };

  const readingTime = readingDuration(
    article.markdown_content || article.content,
    {
      wordsPerMinute: 200,
      emoji: false,
    }
  );

  return (
    <article>
      <header className="mb-8 scroll-mt-16">
        <h1 className="font-sans text-[#242424] dark:text-white font-bold text-3xl md:text-[42px] leading-tight md:leading-[52px] tracking-normal md:tracking-[-0.011em] mb-4 md:mb-8 mt-0 break-words overflow-wrap-break-word">
          {article.title}
        </h1>
        <div className="flex items-center gap-6 text-gray-500">
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faClock}
              className="mr-2"
              width={16}
              height={16}
            />
            <span>{readingTime}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote("up")}
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <FontAwesomeIcon
                icon={userVote === "up" ? fasThumbsUp : farThumbsUp}
                className={userVote === "up" ? "text-blue-500" : ""}
                width={16}
                height={16}
              />
              <span>{thumbsUp}</span>
            </button>

            <button
              onClick={() => handleVote("down")}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <FontAwesomeIcon
                icon={userVote === "down" ? fasThumbsDown : farThumbsDown}
                className={userVote === "down" ? "text-red-500" : ""}
                width={16}
                height={16}
              />
              <span>{thumbsDown}</span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-4 custom-markdown 
        dark:prose-headings:text-white 
        dark:prose-code:text-white 
        [&_.token]:!dark:text-white
        [&_span[class*='token']]:!dark:text-white
        [&_span[class*='language-']]:!dark:text-white
        [&_span[class*='liquid']]:!dark:text-white
        prose-headings:scroll-mt-16
        [&_.math-display]:overflow-x-auto
        [&_.math-display]:max-w-full
        [&_.math-display]:py-4
        [&_.katex-display]:overflow-x-auto
        [&_.katex-display]:max-w-full
        [&_.katex]:overflow-x-auto
        [&_.katex]:max-w-full
        [&_.katex]:!text-black
        dark:[&_.katex]:!text-white
        [&_.katex-html]:!overflow-x-hidden
        [&_.katex-html]:!max-w-full
        [&_.katex]:!overflow-y-hidden
        [&_.katex-display]:!overflow-y-hidden
        [&_.katex]:!break-words
        [&_.katex-display]:!break-words"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm as any, remarkMath]}
          rehypePlugins={[rehypeKatex as any]}
          components={customRenderers}
        >
          {article.markdown_content || article.content}
        </ReactMarkdown>
        <div>
          {article.image_url && <Image path={article.image_url} user={user} />}
          {article.audio_url && (
            <audio
              controls
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/audio/${article.audio_url}`}
              className="mb-4 w-full"
            />
          )}
        </div>
      </div>
    </article>
  );
}
