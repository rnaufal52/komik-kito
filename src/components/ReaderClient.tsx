"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ReaderClientProps {
  images: string[];
  chapterTitle: string;
  files: { title: string; slug: string; date: string }[]; // Full chapter list
  currentSlug: string;
  comicSlug: string;
  prevSlug: string | null;
  nextSlug: string | null;
}

export function ReaderClient({
  images,
  chapterTitle,
  files,
  currentSlug,
  comicSlug,
  prevSlug,
  nextSlug,
}: ReaderClientProps) {
  const router = useRouter();
  const [showControls, setShowControls] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1); // 1 = Slow, 5 = Fast
  const [progress, setProgress] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle controls on click (unless clicking interactive elements)
  const toggleControls = (e: React.MouseEvent) => {
    // Prevent toggling if clicking buttons/inputs
    if ((e.target as HTMLElement).closest("button, a, input, select")) return;
    setShowControls((prev) => !prev);
  };

  // Scroll active chapter into view when selector opens
  useEffect(() => {
      if (showSelector) {
          const activeBtn = document.getElementById(`chapter-${currentSlug}`);
          if (activeBtn) {
              activeBtn.scrollIntoView({ block: "center" });
          }
      }
  }, [showSelector, currentSlug]);

  // Scroll Progress Listener
  const handleScroll = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const progressVal = (currentScroll / totalHeight) * 100;
    setProgress(Math.min(100, Math.max(0, progressVal)));

    // Auto-Next Detection (Near bottom)
    if (progressVal > 99 && nextSlug && autoScroll) {
       setAutoScroll(false); // Stop scrolling
       // Optional: Auto redirect could go here, but let's stick to a visible button for safety
    }
  }, [nextSlug, autoScroll]);

  // Scroll Saving & History Logic
  useEffect(() => {
    // 1. Restore Scroll Position if available
    const savedScroll = localStorage.getItem(`scroll-${currentSlug}`);
    if (savedScroll) {
      window.scrollTo({ top: parseInt(savedScroll), behavior: "auto" });
    }

    // 2. Save Reading History & Sync
    const updateHistory = () => {
        const historyData = localStorage.getItem("reading-history");
        let parsedVideo = historyData ? JSON.parse(historyData) : {};
        
        // Initial object if empty
        const comicHistory = parsedVideo[comicSlug] || {
            lastReadSlug: currentSlug,
            lastReadTitle: chapterTitle,
            readChapters: [],
            lastScrollPosition: 0,
            lastUpdated: Date.now()
        };

        // Update basic info
        comicHistory.lastReadSlug = currentSlug;
        comicHistory.lastReadTitle = chapterTitle;
        comicHistory.lastUpdated = Date.now();
        
        // Add current chapter to read list if not present
        if (!comicHistory.readChapters.includes(currentSlug)) {
            comicHistory.readChapters.push(currentSlug);
        }

        parsedVideo[comicSlug] = comicHistory;
        localStorage.setItem("reading-history", JSON.stringify(parsedVideo));
        
        // SYNC TO BOOKMARKS
        // If this comic is in bookmarks, update its last read chapter info to match history
        const bookmarks = localStorage.getItem("bookmarks");
        if (bookmarks) {
            let bookmarkList = JSON.parse(bookmarks);
            const bookmarkIndex = bookmarkList.findIndex((b: any) => b.slug === comicSlug);
            
            if (bookmarkIndex !== -1) {
                // We found the bookmark, let's update it with latest chapter info if we want to track it there too
                // For now, the user wants "simpan di bookmark komik yang sudah dibaca". 
                // This implies "Auto-Bookmark" or just "History".
                // If we treat "Bookmark" as "Subscribed", we might not want to auto-add.
                // But the user said "saved in bookmark comics that have been read".
                // Let's purely rely on History tab for "Read" comics, and keep Bookmarks for "Subscribed".
                // However, we can update metadata in bookmark if it exists.
                bookmarkList[bookmarkIndex].lastRead = {
                    slug: currentSlug,
                    title: chapterTitle,
                    updatedAt: Date.now()
                };
                localStorage.setItem("bookmarks", JSON.stringify(bookmarkList));
            }
        }
    };

    updateHistory();

    // 3. Save Scroll & Update Progress
    const onScroll = () => {
      localStorage.setItem(`scroll-${currentSlug}`, window.scrollY.toString());
      handleScroll(); // Update progress bar
    };
    
    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentSlug, comicSlug, chapterTitle, handleScroll]);

  // Auto Scroll Effect
  useEffect(() => {
    if (autoScroll) {
      // Speed calculation: 1 (Slow) -> 30ms/px, 10 (Fast) -> 3ms/px
      const intervalTime = Math.max(2, (11 - scrollSpeed) * 3);
      
      autoScrollInterval.current = setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'auto' });
      }, intervalTime);
    } else {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    }

    return () => {
      if (autoScrollInterval.current) clearInterval(autoScrollInterval.current);
    };
  }, [autoScroll, scrollSpeed]);
  
  // Helper to check if chapter is read
  const isChapterRead = (slug: string) => {
      if (typeof window === "undefined") return false;
      const historyData = localStorage.getItem("reading-history");
      if (!historyData) return false;
      const parsed = JSON.parse(historyData);
      return parsed[comicSlug]?.readChapters?.includes(slug) || false;
  };

  const handleChapterChange = (slug: string) => {
    router.push(`/comic/${comicSlug}/read/${slug}`);
  };

  return (
    <div className="relative min-h-screen bg-[#1a1a1a]" onClick={toggleControls}>
      {/* Reading Progress Bar (Always Visible) */}
      <div 
        className="fixed bottom-0 left-0 h-1.5 bg-primary z-[60] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(34,197,94,0.7)]"
        style={{ width: `${progress}%` }}
      />

      {/* Header Overlay */}
      <div className={`fixed top-0 w-full bg-black/90 text-white z-50 transition-transform duration-300 ${showControls ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          {/* ... existing header ... */}
          <Link href={`/comic/${comicSlug}`} className="flex items-center gap-2 hover:text-primary">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="font-bold line-clamp-1">{chapterTitle}</span>
          </Link>
          
          <div className="relative">
            <button 
                onClick={() => setShowSelector(!showSelector)}
                className="px-3 py-1 rounded border border-gray-600 text-xs font-bold hover:bg-white hover:text-black transition-colors"
            >
                {currentSlug}
            </button>
            
            {/* Chapter Selector Dropdown */}
            {showSelector && (
                 <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto bg-white text-black rounded shadow-xl z-[70] flex flex-col">
                    {files.map((ch) => {
                        const isRead = isChapterRead(ch.slug);
                        return (
                        <button
                            key={ch.slug}
                            id={`chapter-${ch.slug}`}
                            onClick={() => handleChapterChange(ch.slug)}
                            className={`text-left px-4 py-3 text-sm border-b hover:bg-gray-100 flex justify-between items-center ${ch.slug === currentSlug ? "bg-green-50 text-primary font-bold" : ""}`}
                        >
                            <span className="truncate flex-1">{ch.title}</span>
                            {isRead && (
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded ml-2">READ</span>
                            )}
                        </button>
                    )})}
                 </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center bg-black min-h-screen pb-20 pt-16 sm:pt-20">
        {images.map((src, idx) => (
          <div key={idx} className="relative w-full">
            <Image
                src={src}
                alt={`Page ${idx + 1}`}
                width={800}
                height={1200}
                className="w-full h-auto block" // block removes bottom gap
                quality={80}
                priority={idx < 3}
                unoptimized // Use unoptimized if remote patterns are tricky or for better performance on long lists sometimes
            />
          </div>
        ))}
        
        {/* End of Chapter Navigation */}
        <div className="w-full bg-[#1a1a1a] p-8 flex flex-col items-center gap-6 mt-4">
             <p className="text-gray-400 text-sm">You have reached the end of the chapter.</p>
             <div className="flex gap-4">
                 {prevSlug && (
                     <Link href={`/comic/${comicSlug}/read/${prevSlug}`} className="px-6 py-2 rounded-full border border-gray-500 text-white hover:bg-white hover:text-black transition-colors font-bold">
                         Previous
                     </Link>
                 )}
                 {nextSlug ? (
                      <Link href={`/comic/${comicSlug}/read/${nextSlug}`} className="px-8 py-2 rounded-full bg-primary text-white hover:bg-green-600 transition-colors font-bold shadow-lg shadow-green-500/20">
                         Next Chapter
                     </Link>
                 ) : (
                     <span className="text-gray-500 px-6 py-2">No more chapters</span>
                 )}
             </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className={`fixed bottom-0 w-full bg-black/90 text-white z-50 transition-transform duration-300 border-t border-white/10 ${showControls ? "translate-y-0" : "translate-y-full"}`}>
         <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
            
            {/* Auto Scroll Controls */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setAutoScroll(!autoScroll)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${autoScroll ? "bg-primary text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
                >
                    {autoScroll ? "Stop Scroll" : "Auto Scroll"}
                </button>
                
                {autoScroll && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Speed</span>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={scrollSpeed} 
                            onChange={(e) => setScrollSpeed(Number(e.target.value))}
                            className="w-20 accent-primary h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                )}
            </div>

             {/* Navigation Mini */}
             <div className="flex items-center gap-2">
                {prevSlug ? (
                    <Link href={`/comic/${comicSlug}/read/${prevSlug}`} className="p-2 rounded-full hover:bg-white/10 text-white">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </Link>
                ) : (
                     <div className="p-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                     </div>
                )}

                 {nextSlug ? (
                    <Link href={`/comic/${comicSlug}/read/${nextSlug}`} className="p-2 rounded-full hover:bg-primary text-white bg-white/10 transition-colors">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-180">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </Link>
                 ) : (
                    <div className="p-2 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rotate-180">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
}
