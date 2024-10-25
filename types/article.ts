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
}
