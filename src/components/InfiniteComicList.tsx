"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ComicCard } from "./ComicCard";
import { ApiComic } from "@/types/api";
import { fetchComicsAction } from "@/app/actions";

interface InfiniteComicListProps {
  initialComics: ApiComic[];
  initialPage: number;
  tipe: "manga" | "manhwa" | "manhua";
  genre: string;
  genre2?: string;
  status: string;
}

export function InfiniteComicList({
  initialComics,
  initialPage,
  tipe,
  genre,
  genre2 = "",
  status,
}: InfiniteComicListProps) {
  const [comics, setComics] = useState<ApiComic[]>(initialComics);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Reset list when filters change
  useEffect(() => {
    setComics(initialComics);
    setPage(initialPage);
    setHasMore(true);
  }, [initialComics, initialPage, tipe, genre, genre2, status]);

  const lastComicElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreComics();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreComics = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const newComics = await fetchComicsAction(tipe, nextPage, genre, status, genre2);

    if (newComics.length === 0) {
      setHasMore(false);
    } else {
      setComics((prev) => [...prev, ...newComics]);
      setPage(nextPage);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 mb-12">
        {comics.map((comic, idx) => {
          if (idx === comics.length - 1) {
            return (
              <div ref={lastComicElementRef} key={`${comic.slug}-${idx}`}>
                <ComicCard comic={comic} />
              </div>
            );
          } else {
            return <ComicCard key={`${comic.slug}-${idx}`} comic={comic} />;
          }
        })}
      </div>
      
      {loading && (
        <div className="flex justify-center py-8">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-400 font-medium">Loading more comics...</span>
            </div>
        </div>
      )}
      
      {!hasMore && comics.length > 0 && (
         <div className="text-center py-8 text-gray-400 text-sm">
             You've reached the end of the list.
         </div>
      )}
    </>
  );
}
