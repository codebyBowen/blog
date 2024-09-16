"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function ArticleImage({ path, user} : {path: string, user: any}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    async function getImageUrl() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/authenticated/images/${path}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + user.session.access_token ,
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log('url', url)
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }

    getImageUrl();

    // Cleanup function to revoke the object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [path]);

  console.log('imageUrl', imageUrl, user)
  if (!imageUrl) return null

  return (
    <img 
      src={imageUrl} 
      alt="Article image"
      className="mb-4 max-w-full h-auto"
    />
  )
}