"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface ListFilterProps {
  genres: string[];
}

export function ListFilter({ genres }: ListFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get current values
  const currentType = searchParams.get("tipe") || "manhwa";
  const currentGenre = searchParams.get("genre") || "";
  const currentGenre2 = searchParams.get("genre2") || "";
  const currentStatus = searchParams.get("status") || "";

  // Check if any filter is active (excluding default type)
  const isFiltered = currentGenre || currentGenre2 || currentStatus || currentType !== "manhwa";
  
  // Count active filters for badge
  const activeCount = [
    currentType !== 'manhwa' ? 1 : 0, 
    currentGenre ? 1 : 0, 
    currentGenre2 ? 1 : 0, 
    currentStatus ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  // Helper to update query
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page when filter changes
      if (name !== 'page') {
          params.set('page', '1');
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleChange = (name: string, value: string) => {
    router.push("/list?" + createQueryString(name, value));
  };

  const handleReset = () => {
      router.push("/list");
  };

  return (
    <div className="mb-8">
        
      {/* Header Row: Title & Toggle & Active Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">List Komik</h1>
        
        <div className="flex flex-wrap items-center gap-3">
        <button 
           onClick={() => setIsOpen(!isOpen)}
           className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
               isOpen 
               ? "bg-black text-white shadow-md"
               : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
           }`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
             {activeCount > 0 && !isOpen && (
                 <span className="ml-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                     {activeCount}
                 </span>
             )}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {isFiltered && (
            <div className="flex items-center gap-3">
                 {/* Summary Chips (Visible when closed) */}
                 {!isOpen && (
                     <div className="flex flex-wrap gap-2 text-xs font-semibold">
                         {currentType !== 'manhwa' && <span className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 border border-gray-200">{currentType}</span>}
                         {currentStatus && <span className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 capitalize border border-gray-200">{currentStatus}</span>}
                         {currentGenre && <span className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 border border-gray-200">{currentGenre}</span>}
                         {currentGenre2 && <span className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 border border-gray-200">{currentGenre2}</span>}
                     </div>
                 )}
                 <button 
                  onClick={handleReset}
                  className="text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                 >
                    Reset
                 </button>
            </div>
        )}
      </div>
      </div>

      {/* Expandable Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-6">
                
                {/* Top Row: Type and Status */}
                <div className="flex flex-col md:flex-row gap-8 md:items-start border-b border-gray-50 pb-6">
                    {/* Type Filter - Segmented Control */}
                    <div className="flex flex-col gap-3">
                    <span className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider">Tipe</span>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {[
                            { label: 'Manhwa', value: 'manhwa' },
                            { label: 'Manga', value: 'manga' },
                            { label: 'Manhua', value: 'manhua' },
                        ].map((type) => (
                            <button
                                key={type.value}
                                onClick={() => handleChange("tipe", type.value)}
                                className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    currentType === type.value
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    </div>

                    {/* Status Filter - Pill Group */}
                    <div className="flex flex-col gap-3 flex-1">
                    <span className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider">Status</span>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { label: 'Semua', value: '' },
                            { label: 'Ongoing', value: 'ongoing' },
                            { label: 'Tamat', value: 'end' },
                        ].map((status) => {
                            const isActive = currentStatus === status.value;
                            return (
                                <button
                                    key={status.value}
                                    onClick={() => handleChange("status", status.value)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                        isActive
                                        ? "bg-primary text-white border-primary shadow-primary/30 shadow-lg ring ring-primary/20"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                                >
                                    {status.label}
                                </button>
                            );
                        })}
                    </div>
                    </div>
                </div>

                {/* Bottom Row: Genres */}
                <div className="flex flex-col gap-3">
                <span className="text-xs font-extra-bold text-gray-400 uppercase tracking-wider">Genre</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Genre 1 */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded">1</span>
                        </div>
                        <select
                            value={currentGenre}
                            onChange={(e) => handleChange("genre", e.target.value)}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        >
                            <option value="">Semua Genre</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-gray-600">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>

                    {/* Genre 2 */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 font-bold text-xs bg-gray-100 px-1.5 py-0.5 rounded">2</span>
                        </div>
                        <select
                            value={currentGenre2}
                            onChange={(e) => handleChange("genre2", e.target.value)}
                            className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                        >
                            <option value="">Filter Tambahan</option>
                            {genres.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-gray-600">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
