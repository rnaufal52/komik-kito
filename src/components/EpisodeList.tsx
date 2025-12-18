"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Chapter {
  title: string;
  slug: string;
  date: string;
}

interface EpisodeListProps {
  comicSlug: string;
  chapters: Chapter[];
}

interface HistoryData {
    lastReadSlug: string;
    lastReadTitle: string;
    readChapters: string[];
}

export function EpisodeList({ comicSlug, chapters }: EpisodeListProps) {
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [activeRange, setActiveRange] = useState(0);

  // Create a sorted copy of chapters (Ascending: Oldest first)
  // Assuming API returns Descending (Newest first), we reverse it.
  const sortedChapters = [...chapters].reverse();

  // Group chapters by 25
  const chunkSize = 25;
  const chunkedChapters = [];
  for (let i = 0; i < sortedChapters.length; i += chunkSize) {
    chunkedChapters.push(sortedChapters.slice(i, i + chunkSize));
  }

  // Ensure active range is valid (if chapters change)
  useEffect(() => {
     setActiveRange(0);
  }, [comicSlug]);

  useEffect(() => {
     const stored = localStorage.getItem("reading-history");
     if (stored) {
         const parsed = JSON.parse(stored);
         if (parsed[comicSlug]) {
             setHistory(parsed[comicSlug]);
         }
     }
  }, [comicSlug]);

  const currentChapters = chunkedChapters[activeRange] || [];

  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* Continue Reading Button */}
      {history && history.lastReadSlug && (
           <div className="mb-2">
               <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                   <div className="text-sm text-blue-800">
                       Last read: <span className="font-bold">{history.lastReadTitle}</span>
                   </div>
                   <Link href={`/comic/${comicSlug}/read/${history.lastReadSlug}`} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-colors shadow-sm">
                       Continue Reading
                   </Link>
               </div>
           </div>
      )}

      {/* Range Selector */}
      {chunkedChapters.length > 1 && (
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
              {chunkedChapters.map((_, idx) => {
                  const start = idx * chunkSize + 1;
                  const end = Math.min((idx + 1) * chunkSize, chapters.length);
                  return (
                      <button
                        key={idx}
                        onClick={() => setActiveRange(idx)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                            activeRange === idx 
                            ? "bg-black text-white shadow-md" 
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                          {start} - {end}
                      </button>
                  );
              })}
          </div>
      )}

      {/* Chapters Grid (Scrollable) */}
      <div className="max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
            {currentChapters.map((chapter) => {
                const isRead = history?.readChapters.includes(chapter.slug);
                return (
                    <Link
                    key={chapter.slug}
                    href={`/comic/${comicSlug}/read/${chapter.slug}`}
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
                        isRead 
                        ? "bg-gray-50 border-gray-100 opacity-70" 
                        : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30"
                    }`}
                    >
                        <h3 className={`font-bold text-sm mb-2 line-clamp-2 ${isRead ? "text-gray-500" : "text-gray-900"}`}>
                            {chapter.title}
                        </h3>
                         <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100/50">
                             <span className="text-[10px] text-gray-400 font-medium">{chapter.date}</span>
                             {isRead && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">READ</span>
                             )}
                        </div>
                    </Link>
                );
            })}
          </div>
          {currentChapters.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No chapters found.</div>
          )}
      </div>
    </div>
  );
}
