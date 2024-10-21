"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { Article } from "../../../types/article";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import slugify from "slugify";
import { Components } from "react-markdown";
import Image from "@/components/Image";

export default function ArticleContent({
  article,
  user,
}: {
  article: Article;
  user: any;
}) {
  const [toc, setToc] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  const [activeId, setActiveId] = useState("");
  const [showToc, setShowToc] = useState(false); // TOC is hidden by default
  const contentRef = useRef<HTMLDivElement>(null);

  const getTextFromChildren = (children: ReactNode): string => {
    if (typeof children === "string") {
      return children;
    } else if (Array.isArray(children)) {
      return children.map(getTextFromChildren).join("");
    } else if (React.isValidElement(children) && children.props.children) {
      return getTextFromChildren(children.props.children);
    } else {
      return "";
    }
  };

  const createHeadingComponent = (level: number) => {
    return ({ children }: { children: ReactNode }) => {
      const headingText = getTextFromChildren(children);
      const id = slugify(headingText, { lower: true, strict: true });
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag
          id={id}
          style={{ scrollMarginTop: "80px" }} // Adjust according to your fixed header height
        >
          {children}
        </HeadingTag>
      );
    };
  };

  const customRenderers: Partial<Components> = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <code className={`block ${className}`} {...props}>
          {children}
        </code>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: createHeadingComponent(1),
    h2: createHeadingComponent(2),
    h3: createHeadingComponent(3),
    h4: createHeadingComponent(4),
    h5: createHeadingComponent(5),
    h6: createHeadingComponent(6),
  };

  useEffect(() => {
    const content = article.markdown_content || article.content;
    const headings = content.match(/#{1,6}.+/g) || [];
    const tocItems = headings.map((heading) => {
      const level = heading.match(/^#+/)?.[0].length ?? 1;
      const title = heading.replace(/^#+\s*/, "").replace(/[*_`]/g, "");
      const id = slugify(title, { lower: true, strict: true });
      return { id, title, level };
    });
    setToc(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    tocItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [article]);

  return (
    <div className="relative">
      {/* TOC Overlay */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          showToc ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ paddingTop: "80px" }} // Adjust to not overlap header bar
      >
        <div className="p-4 overflow-y-auto h-full">
          <button
            onClick={() => setShowToc(false)}
            className="mb-4 text-gray-700 dark:text-gray-300"
          >
            Close
          </button>
          <h2 className="text-xl font-bold mb-4 dark:text-white">Contents</h2>
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li
                key={item.id}
                style={{ marginLeft: `${(item.level - 1) * 8}px` }}
              >
                <a
                  href={`#${item.id}`}
                  className={`block py-1 ${
                    activeId === item.id
                      ? "text-blue-500 font-semibold"
                      : "text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* TOC Toggle Button */}
      <button
        onClick={() => setShowToc(!showToc)}
        className="fixed top-24 left-8 z-10 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md w-10 h-10 flex flex-col justify-center items-center"
      >
        <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 mb-1"></span>
        <span className="block w-5 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
      </button>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="prose prose-lg dark:prose-invert max-w-none mb-4 custom-markdown dark:prose-headings:text-white dark:prose-code:text-white"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm as any]}
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
    </div>
  );
}
