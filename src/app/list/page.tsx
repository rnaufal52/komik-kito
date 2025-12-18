import { KomikuService } from "@/services/komiku";
import { ComicCard } from "@/components/ComicCard";
import { ListFilter } from "@/components/ListFilter";
import Link from "next/link";
import { InfiniteComicList } from "@/components/InfiniteComicList";

interface PageProps {
  searchParams: Promise<{
    tipe?: "manga" | "manhwa" | "manhua";
    page?: string;
    genre?: string;
    status?: string;
    genre2?: string;
  }>;
}

export default async function ListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const tipe = params.tipe || "manhwa";
  const genre = params.genre || "";
  const genre2 = params.genre2 || "";
  const status = params.status || "";

  // Fetch data in parallel
  const [comics, genres] = await Promise.all([
    KomikuService.getAllComics(tipe, page, genre, status, genre2),
    KomikuService.getGenres(),
  ]);

  const hasNextPage = comics.length > 0; // Simple check, ideally API returns meta

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col">
        <ListFilter genres={genres} />

        {comics.length === 0 ? (
           <div className="py-20 text-center text-gray-400">
             <p className="text-lg font-medium">No comics found.</p>
             <p className="text-sm">Try adjusting your filters.</p>
           </div>
        ) : (
            <InfiniteComicList 
                initialComics={comics} 
                initialPage={page} 
                tipe={tipe} 
                genre={genre}
                genre2={genre2}
                status={status} 
            />
        )}
      </div>
    </div>
  );
}
