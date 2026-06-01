# Seeding the "2026 Memory Super-Cycle" D3 article

The article lives as Markdown in [`content/storage-supercycle-2026.md`](../../content/storage-supercycle-2026.md)
and renders through the normal article pipeline. The five interactive charts are
plain fenced code-blocks tagged ` ```viz ` (e.g. `{ "chart": "ytd-returns" }`),
mounted by `components/d3/` via the renderer in `app/article/[id]/ArticleContent.tsx`.

## Preview locally (no Supabase needed)

```bash
bun dev
# open http://localhost:3000/storage-supercycle-demo
```

## Option A — Node script (recommended)

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="..."     # bypasses RLS for the insert
export SEED_USER_ID="<your-auth-user-uuid>" # optional: attach to your account

node scripts/seed-storage-article.mjs
```

Re-running **updates** the existing row (matched by title) instead of duplicating.

## Option B — SQL (paste into the Supabase dashboard)

Regenerate the statement from the Markdown, then run it in the SQL editor:

```bash
node scripts/seed-storage-article.mjs --print-sql
# -> supabase/seed/storage-supercycle-2026.sql
```

Open Supabase → **SQL Editor** → paste the file → **Run**.

> The `content` column gets a short plain-text summary (used for SEO/meta);
> the full Markdown — including the `viz` charts — goes in `markdown_content`,
> which is what the article page actually renders.
