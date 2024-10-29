import { MetadataRoute } from 'next'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClientComponentClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, updated_at");

  const baseUrl = 'https://thebowvee.com'
  
  const articlesUrls = articles?.map((article) => ({
    url: `${baseUrl}/article/${article.id}`,
    lastModified: article.updated_at,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...articlesUrls,
  ]
}