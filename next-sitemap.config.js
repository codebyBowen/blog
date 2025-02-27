const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

module.exports = {
    siteUrl: 'https://thebowvee.com/',
    generateRobotsTxt: true,
    // Optional configurations
    changefreq: 'weekly',
    outDir: 'public',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin/*', '/private/*'],
    
    // 添加自定义路径生成函数
    additionalPaths: async (config) => {
      const result = [];
      
      try {
        // 从 Supabase 获取所有文章 ID
        const { data: articles, error } = await supabase
          .from('articles')
          .select('id');
        
        if (error) throw error;
        
        // 为每篇文章创建 URL
        for (const article of articles) {
          result.push({
            loc: `/article/${article.id}`,
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error fetching article IDs for sitemap:', error);
      }
      
      return result;
    },
  }