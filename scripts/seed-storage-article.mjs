// Seed (or update) the "2026 Memory Super-Cycle" D3 article in Supabase.
//
//   node scripts/seed-storage-article.mjs              # insert/update via the API
//   node scripts/seed-storage-article.mjs --print-sql  # write a ready-to-run .sql
//
// Env:
//   NEXT_PUBLIC_SUPABASE_URL        (required for DB insert)
//   SUPABASE_SERVICE_ROLE_KEY       (recommended — bypasses RLS) or
//   NEXT_PUBLIC_SUPABASE_ANON_KEY   (works only if RLS allows anon insert)
//   SEED_USER_ID                    (optional — attaches the post to your account)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const MD = readFileSync(
  path.join(ROOT, "content", "storage-supercycle-2026.md"),
  "utf8"
);

const TITLE =
  "The 2026 Memory Super-Cycle: Anatomy of the Storage Sector's Historic Anomaly";
const SUMMARY =
  "A data-driven anatomy of the 2026 memory/storage (存储板块) super-cycle — prices, HBM, revenue per bit, and China's A-share explosion — rendered with interactive D3.";
const TAG = "Finance";
const VISIBILITY = "public";

function buildSql() {
  const userId = process.env.SEED_USER_ID || null;
  const cols = ["title", "content", "markdown_content", "tag", "visibility"];
  const vals = [
    `$t$${TITLE}$t$`,
    `$c$${SUMMARY}$c$`,
    `$md$${MD}$md$`,
    `'${TAG}'`,
    `'${VISIBILITY}'`,
  ];
  if (userId) {
    cols.push("user_id");
    vals.push(`'${userId}'`);
  }
  return (
    `-- Generated from content/storage-supercycle-2026.md\n` +
    `-- Paste into Supabase → SQL Editor → Run.\n` +
    `insert into public.articles (${cols.join(", ")})\n` +
    `values (${vals.join(",\n        ")});\n`
  );
}

if (process.argv.includes("--print-sql")) {
  const out = path.join(ROOT, "supabase", "seed", "storage-supercycle-2026.sql");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, buildSql(), "utf8");
  console.log("Wrote", path.relative(ROOT, out));
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY\n" +
      "(or NEXT_PUBLIC_SUPABASE_ANON_KEY). Or run with --print-sql to emit SQL instead."
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const row = {
  title: TITLE,
  content: SUMMARY,
  markdown_content: MD,
  tag: TAG,
  visibility: VISIBILITY,
};
if (process.env.SEED_USER_ID) row.user_id = process.env.SEED_USER_ID;

const { data: existing, error: findErr } = await supabase
  .from("articles")
  .select("id")
  .eq("title", TITLE)
  .maybeSingle();

if (findErr) {
  console.error("Lookup failed:", findErr.message);
  process.exit(1);
}

let result;
if (existing?.id) {
  result = await supabase
    .from("articles")
    .update(row)
    .eq("id", existing.id)
    .select("id")
    .single();
} else {
  result = await supabase
    .from("articles")
    .insert(row)
    .select("id")
    .single();
}

if (result.error) {
  console.error("Write failed:", result.error.message);
  process.exit(1);
}
console.log(
  `${existing?.id ? "Updated" : "Inserted"} article #${result.data.id} → /article/${result.data.id}`
);
