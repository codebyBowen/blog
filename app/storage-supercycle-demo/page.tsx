import fs from "fs";
import path from "path";
import { Metadata } from "next";
import TopBar from "@/components/TopBar";
import ArticleContent from "@/app/article/[id]/ArticleContent";
import { Article } from "@/types/article";

export const metadata: Metadata = {
  title: "The 2026 Memory Super-Cycle — D3 demo",
  robots: { index: false },
};

// Local preview of the D3 article without needing Supabase.
// The real post is seeded into the DB via scripts/seed-storage-article.mjs.
export default function StorageSupercycleDemo() {
  const md = fs.readFileSync(
    path.join(process.cwd(), "content", "storage-supercycle-2026.md"),
    "utf8"
  );

  const article: Article = {
    id: 0,
    title:
      "The 2026 Memory Super-Cycle: Anatomy of the Storage Sector's Historic Anomaly",
    content:
      "A data-driven anatomy of the 2026 memory/storage (存储板块) super-cycle, rendered with interactive D3.",
    markdown_content: md,
    created_at: new Date().toISOString(),
    views: 0,
    visibility: "public",
    tag: "Finance",
  };

  return (
    <>
      <TopBar />
      <div className="mx-auto mt-10 max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <ArticleContent article={article} user={null} />
      </div>
    </>
  );
}
