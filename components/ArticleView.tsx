'use client'

import { useEffect } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ArticleView({ articleId }: { articleId: number }) {
  useEffect(() => {
    console.log("articleId", articleId);
    const incrementViewCount = async () => {
      const supabase = createClientComponentClient();
      await supabase.rpc('increment_view_count', { article_id: articleId });
    };

    incrementViewCount();
  }, [articleId]);

  return null;
}