import { MetadataRoute } from 'next'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClientComponentClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, updated_at, title")
    .eq("visibility", "public"); // Only include public articles

  const baseUrl = 'https://thebowvee.com'

  // Function to create slug from title
  function createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  const articlesUrls = articles?.map((article) => ({
    url: `${baseUrl}/article/${article.id}/${createSlug(article.title)}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  return [
    ...staticPages,
    ...articlesUrls,
  ]
}