'use client'

import { useEffect } from 'react';

export default function ArticleView({ articleId }: { articleId: number }) {
  useEffect(() => {
    fetch(`/api/articles/${articleId}/view`, { method: 'POST' }).catch(() => {});
  }, [articleId]);

  return null;
}
