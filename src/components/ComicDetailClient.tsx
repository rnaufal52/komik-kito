"use client";

import { EpisodeList } from "@/components/EpisodeList";
import { SubscribeButton } from "@/components/SubscribeButton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getComicDetailAction } from "@/app/actions";
import { ComicDetail } from "@/types/api";
import { ComicDetailSkeleton } from "@/components/skeletons/ComicDetailSkeleton";

interface ComicDetailClientProps {
    slug: string;
}

export function ComicDetailClient({ slug }: ComicDetailClientProps) {
    const [comic, setComic] = useState<ComicDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComic = async () => {
            const data = await getComicDetailAction(slug);
            setComic(data);
            setLoading(false);
        };
        fetchComic();
    }, [slug]);

    if (loading || !comic) {
        return <ComicDetailSkeleton />;
    }

    // Use the first chapter for "First Episode" button if available
    const firstChapterSlug = comic.chapters.length > 0 ? comic.chapters[comic.chapters.length - 1].slug : null;

    return (
        <div className="flex flex-col">
          {/* Comic Header info */}
          <div className="bg-white">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-12 sm:flex-row sm:items-start sm:px-6 lg:px-8">
                <div className="relative h-[250px] w-[200px] flex-shrink-0 overflow-hidden rounded-lg shadow-md sm:h-[300px] sm:w-[220px]">
                    <Image
                        src={comic.thumbnail}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        priority
                        quality={95}
                        sizes="(max-width: 640px) 200px, 220px"
                        unoptimized
                    />
                </div>
                <div className="flex flex-1 flex-col text-center sm:text-left">
                    <span className="mb-2 text-primary font-bold uppercase tracking-wider text-sm">
                        {comic.info.jenis_komik}
                    </span>
                    <h1 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {comic.title}
                    </h1>
                    <p className="mb-6 text-gray-500 font-medium">
                        {comic.info.pengarang}
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 sm:justify-start">
                         <div className="flex flex-col items-center sm:items-start">
                            <span className="font-bold text-gray-900">{comic.info.status}</span>
                            <span>Status</span>
                        </div>
                         <div className="h-8 w-px bg-gray-200"></div>
                         <div className="flex flex-col items-center sm:items-start">
                            <span className="font-bold text-gray-900">{comic.info.cara_baca}</span>
                            <span>Reading Mode</span>
                        </div>
                    </div>
                     <p className="mt-8 max-w-2xl text-gray-600 leading-relaxed">
                        {comic.synopsis || "No synopsis available for this comic. Read the episodes to find out more!"}
                     </p>
                     <div className="mt-8 flex justify-center gap-4 sm:justify-start">
                        {firstChapterSlug && (
                            <Link href={`/comic/${comic.slug}/read/${firstChapterSlug}`} className="rounded-full bg-primary px-10 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 hover:bg-green-600 hover:shadow-green-600/30 transition-all">
                                First Episode
                            </Link>
                        )}
                        <SubscribeButton comic={{
                            slug: comic.slug,
                            title: comic.title,
                            thumbnail: comic.thumbnail,
                            type: comic.info.jenis_komik,
                            latest_chapter: comic.chapters[0]?.title || 'Unknown' 
                        }} />
                     </div>
                </div>
            </div>
          </div>
    
          {/* Episode List */}
          <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
             <h2 className="mb-4 text-xl font-bold text-gray-900">Episodes</h2>
             <EpisodeList comicSlug={comic.slug} chapters={comic.chapters} />
          </div>
        </div>
      );
}
