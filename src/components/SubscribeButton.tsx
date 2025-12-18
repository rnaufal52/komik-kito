"use client";

import { ApiComic } from "@/types/api";
import { useEffect, useState } from "react";

interface SubscribeButtonProps {
  comic: {
    slug: string;
    title: string;
    thumbnail: string;
    type?: string;
    latest_chapter?: string;
  };
}

export function SubscribeButton({ comic }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if subscribed on mount
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    setIsSubscribed(bookmarks.some((b: any) => b.slug === comic.slug));
  }, [comic.slug]);

  const toggleSubscription = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    
    if (isSubscribed) {
      // Remove
      const newBookmarks = bookmarks.filter((b: any) => b.slug !== comic.slug);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setIsSubscribed(false);
    } else {
      // Add
      const newBookmark = {
        slug: comic.slug,
        title: comic.title,
        thumbnail: comic.thumbnail,
        type: comic.type || 'Comic',
        latest_chapter: comic.latest_chapter || 'Unknown',
        dateAdded: new Date().toISOString(),
      };
      bookmarks.push(newBookmark);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
      setIsSubscribed(true);
    }
  };

  return (
    <button 
        onClick={toggleSubscription}
        className={`rounded-full border px-10 py-3 text-sm font-bold transition-colors ${
            isSubscribed 
            ? "bg-gray-100 border-gray-300 text-gray-900" 
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
}
