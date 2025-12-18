"use client";

import { ApiComic } from "@/types/api";
import { ComicCard } from "@/components/ComicCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getHomeDataAction } from "@/app/actions";
import { HomeSkeleton } from "@/components/skeletons/HomeSkeleton";

interface HomeData {
  popularManga: ApiComic[];
  popularManhwa: ApiComic[];
  popularManhua: ApiComic[];
  newestManga: ApiComic[];
  newestManhwa: ApiComic[];
  newestManhua: ApiComic[];
}

type TabType = "manhwa" | "manga" | "manhua";

export function HomeClient() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [popularTab, setPopularTab] = useState<TabType>("manhwa");
  const [newestTab, setNewestTab] = useState<TabType>("manhwa");

  useEffect(() => {
    const fetchData = async () => {
        const result = await getHomeDataAction();
        if (result) {
            setData(result);
        }
        setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return <HomeSkeleton />;
  }

  // Helper to get data based on tab
  const getPopularData = () => {
    switch (popularTab) {
      case "manga": return data.popularManga;
      case "manhua": return data.popularManhua;
      case "manhwa": default: return data.popularManhwa;
    }
  };

  const getNewestData = () => {
    switch (newestTab) {
      case "manga": return data.newestManga;
      case "manhua": return data.newestManhua;
      case "manhwa": default: return data.newestManhwa;
    }
  };

  // Featured can be from popular manhwa (default)
  const featured = data.popularManhwa[0];

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[400px] w-full bg-white sm:h-[460px]">
           <div className="absolute inset-0">
                <Image
                    src={featured.thumbnail}
                    alt={featured.title}
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                 <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent" />
            </div>
            
            <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-12 sm:px-6 lg:px-8">
                <span className="mb-2 w-fit rounded bg-primary px-3 py-1 text-xs font-bold text-white uppercase shadow-sm">
                    TOP PICK
                </span>
                <h1 className="mb-2 text-3xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl tracking-tight line-clamp-2">
                    {featured.title}
                </h1>
                 <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
                    <span className="uppercase">{featured.type}</span>
                    <span>•</span>
                    <span>{featured.latest_chapter}</span>
                </div>
                <p className="mb-6 max-w-xl text-lg text-gray-600 line-clamp-2 sm:line-clamp-3">
                    {featured.description}
                </p>
                <Link 
                    href={`/comic/${featured.slug}`}
                    className="w-fit rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 hover:bg-green-600 hover:shadow-green-600/30 transition-all"
                >
                    READ NOW
                </Link>
            </div>
        </section>
      )}

      {/* Popular Section */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">Serial Trending & Populer</h2>
                 <Link href={`/list?tipe=${popularTab}&sort=popular`} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                    Lihat semua <span aria-hidden="true">&rsaquo;</span>
                </Link>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {(["manhwa", "manga", "manhua"] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setPopularTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                            popularTab === tab 
                            ? "bg-black text-white shadow-md" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        {tab === 'manhwa' ? 'Manhwa' : tab === 'manga' ? 'Manga' : 'Manhua'}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {getPopularData() && getPopularData().slice(0, 6).map((comic, idx) => (
                <ComicCard key={comic.slug} comic={comic} rank={idx + 1} />
            ))}
        </div>
      </section>

      {/* Newest Section */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
         <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">Rilis Baru</h2>
                 <Link href={`/list?tipe=${newestTab}&sort=newest`} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
                    Lihat semua <span aria-hidden="true">&rsaquo;</span>
                </Link>
            </div>

             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {(["manhwa", "manga", "manhua"] as TabType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setNewestTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                            newestTab === tab 
                            ? "bg-black text-white shadow-md" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                    >
                        {tab === 'manhwa' ? 'Manhwa' : tab === 'manga' ? 'Manga' : 'Manhua'}
                    </button>
                ))}
            </div>
        </div>
         <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {getNewestData() && getNewestData().slice(0, 6).map((comic) => (
                <ComicCard key={`new-${comic.slug}`} comic={comic} />
            ))}
        </div>
      </section>
    </div>
  );
}
