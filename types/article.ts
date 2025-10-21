export type ArticleVisibility = 'public' | 'private' | 'unlisted';

export interface Article {
  id: number;
  title: string;
  content: string;
  markdown_content: string;
  image_url?: string;
  audio_url?: string;
  created_at: string;
  image?: string;
  views: number;
  thumbs_up?: number;
  thumbs_down?: number;
  tag?: string;
  visibility: ArticleVisibility;
  user_id?: string;
}
