"use client";

import { ComicCard } from "@/components/ComicCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApiComic } from "@/types/api";

export default function BookmarkPage() {
  const [activeTab, setActiveTab] = useState<"subscribed" | "history">("subscribed");
  const [bookmarks, setBookmarks] = useState<ApiComic[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // Stores slugs

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
      isOpen: boolean;
      type: "selected" | "all" | null;
      title: string;
      message: string;
  }>({
      isOpen: false,
      type: null,
      title: "",
      message: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
      // 1. Get Subscribed
      const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarks(savedBookmarks.reverse());

      // 2. Get History
      const historyData = JSON.parse(localStorage.getItem("reading-history") || "{}");
      const historyList = Object.keys(historyData).map(slug => ({
          slug,
          ...historyData[slug]
      })).sort((a: any, b: any) => b.lastUpdated - a.lastUpdated);
      
      setHistory(historyList);
      setLoading(false);
  };

  // Toggle Edit Mode
  const toggleEditMode = () => {
      setIsEditMode(!isEditMode);
      setSelectedItems([]);
  };

  // Select/Deselect Item
  const toggleSelection = (slug: string) => {
      if (selectedItems.includes(slug)) {
          setSelectedItems(selectedItems.filter(s => s !== slug));
      } else {
          setSelectedItems([...selectedItems, slug]);
      }
  };

  // Delete Triggers
  const handleDeleteSelected = () => {
      setConfirmModal({
          isOpen: true,
          type: "selected",
          title: "Delete Selected Items?",
          message: `Are you sure you want to delete ${selectedItems.length} items from your ${activeTab}?`
      });
  };

  const handleDeleteAll = () => {
      setConfirmModal({
          isOpen: true,
          type: "all",
          title: "Delete All Items?",
          message: `Are you sure you want to clear your entire ${activeTab} list? This action cannot be undone.`
      });
  };

  // Actual Delete Logic
  const confirmAction = () => {
      if (confirmModal.type === "selected") {
          if (activeTab === "subscribed") {
              const newBookmarks = bookmarks.filter(b => !selectedItems.includes(b.slug));
              localStorage.setItem("bookmarks", JSON.stringify(newBookmarks.reverse()));
              setBookmarks(newBookmarks); 
          } else {
              const historyData = JSON.parse(localStorage.getItem("reading-history") || "{}");
              selectedItems.forEach(slug => delete historyData[slug]);
              localStorage.setItem("reading-history", JSON.stringify(historyData));
              
              const newHistory = history.filter(h => !selectedItems.includes(h.slug));
              setHistory(newHistory);
          }
      } else if (confirmModal.type === "all") {
          if (activeTab === "subscribed") {
              localStorage.setItem("bookmarks", "[]");
              setBookmarks([]);
          } else {
              localStorage.setItem("reading-history", "{}");
              setHistory([]);
          }
      }
      
      // Reset
      setIsEditMode(false);
      setSelectedItems([]);
      setConfirmModal({ isOpen: false, type: null, title: "", message: "" });
  };

  if (loading) {
     return <div className="min-h-screen pt-20 text-center">Loading...</div>;
  }

  const currentCount = activeTab === "subscribed" ? bookmarks.length : history.length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col relative">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">My Library</h1>
            
            {/* Action Buttons */}
            {currentCount > 0 && (
                <div className="flex items-center gap-2">
                    {isEditMode ? (
                        <>
                            <button 
                                onClick={handleDeleteSelected}
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Delete ({selectedItems.length})
                            </button>
                             <button 
                                onClick={handleDeleteAll}
                                className="px-4 py-2 text-red-500 border border-red-200 bg-red-50 rounded-full text-sm font-bold hover:bg-red-100 transition-colors"
                            >
                                Delete All
                            </button>
                            <button 
                                onClick={toggleEditMode}
                                className="px-4 py-2 text-gray-600 font-bold text-sm hover:text-gray-900"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={toggleEditMode}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                </div>
            )}
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 mb-8">
            <button 
                onClick={() => { setActiveTab("subscribed"); setIsEditMode(false); setSelectedItems([]); }}
                className={`pb-3 text-sm font-bold uppercase transition-colors border-b-2 ${activeTab === "subscribed" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
                Subscribed
            </button>
            <button 
                onClick={() => { setActiveTab("history"); setIsEditMode(false); setSelectedItems([]); }}
                className={`pb-3 text-sm font-bold uppercase transition-colors border-b-2 ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-800"}`}
            >
                History
            </button>
        </div>

        {/* Content */}
        {currentCount === 0 ? (
            <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-lg font-medium">Your {activeTab} list is empty.</p>
                {activeTab === "subscribed" && <p className="text-sm mt-2">Start adding comics to follow their updates!</p>}
            </div>
        ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                 {activeTab === "subscribed" ? (
                     bookmarks.map((comic) => (
                         <div key={comic.slug} className="relative group">
                             <ComicCard comic={comic} />
                             {isEditMode && (
                                 <div 
                                     onClick={() => toggleSelection(comic.slug)}
                                     className="absolute inset-0 bg-black/40 cursor-pointer rounded-xl flex items-center justify-center z-10 transition-opacity"
                                 >
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${selectedItems.includes(comic.slug) ? "bg-red-500 border-red-500 text-white" : "bg-white/20 border-white hover:bg-white/40"}`}>
                                         {selectedItems.includes(comic.slug) && (
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                             </svg>
                                         )}
                                     </div>
                                 </div>
                             )}
                         </div>
                     ))
                 ) : (
                     history.map((item) => (
                         <div key={item.slug} className="relative group">
                             {/* History Item Logic (Reusing card structure essentially) */}
                             <div className="flex flex-col gap-2">
                                <Link href={`/comic/${item.slug}`} className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4]">
                                    {/* Placeholder for history since we might not have full image if not cached, but assuming we do or showing Title */}
                                     <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-xs text-center p-2">
                                         {item.lastReadTitle}
                                     </div>
                                     {/* If we had image URL in history, we'd show it. For now let's show a placeholder card style */}
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                     <div className="absolute bottom-0 left-0 p-3 w-full">
                                         <h3 className="text-white font-bold text-sm line-clamp-2 leading-tight">{item.lastReadTitle}</h3>
                                         <p className="text-white/70 text-[10px] mt-1">Last read: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                                     </div>
                                </Link>
                             </div>

                             {isEditMode && (
                                 <div 
                                     onClick={() => toggleSelection(item.slug)}
                                     className="absolute inset-0 bg-black/40 cursor-pointer rounded-xl flex items-center justify-center z-10 transition-opacity"
                                 >
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${selectedItems.includes(item.slug) ? "bg-red-500 border-red-500 text-white" : "bg-white/20 border-white hover:bg-white/40"}`}>
                                         {selectedItems.includes(item.slug) && (
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                             </svg>
                                         )}
                                     </div>
                                 </div>
                             )}
                         </div>
                     ))
                 )}
             </div>
        )}
      </div>

       {/* Confirmation Modal */}
       {confirmModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
                    <p className="text-gray-600 mb-6">{confirmModal.message}</p>
                    <div className="flex gap-3 justify-end">
                        <button 
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            className="px-5 py-2.5 rounded-full text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmAction}
                            className="px-5 py-2.5 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all text-sm"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
}

function EmptyState({ type }: { type: "subscribed" | "history" }) {
    return (
        <div className="py-20 text-center text-gray-400">
             <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
             </div>
             <p className="text-lg font-medium">No {type} comics yet.</p>
             <p className="text-sm mb-6">Start reading to populate your {type} list!</p>
             <Link href="/" className="px-6 py-2 rounded-full bg-primary text-white font-bold hover:bg-green-600 transition-colors">
                Browse Comics
             </Link>
        </div>
    );
}
