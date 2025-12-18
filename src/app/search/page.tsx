import { KomikuService } from "@/services/komiku";
import { ComicCard } from "@/components/ComicCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    s?: string;
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.s || "";

  const results = query ? await KomikuService.searchComics(query) : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Search Comics</h1>
        
        {/* Search Input Form */}
        <form action="/search" method="GET" className="w-full max-w-2xl mb-12">
            <div className="relative">
                <input
                    type="text"
                    name="s"
                    defaultValue={query}
                    placeholder="Search for titles..."
                    className="w-full rounded-full border border-gray-300 bg-gray-50 px-6 py-4 pr-12 text-lg shadow-sm focus:border-primary focus:ring-primary outline-none transition-all"
                    autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </form>

        {query && (
            <div className="w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Results for "<span className="text-primary">{query}</span>"
                </h2>
                
                {results.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                        <p className="text-lg">No comics found matching your query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 mb-12">
                        {results.map((comic, idx) => (
                            <ComicCard key={`${comic.slug}-${idx}`} comic={comic} />
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
