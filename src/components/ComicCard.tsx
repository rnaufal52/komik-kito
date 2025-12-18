import Link from "next/link";
import Image from "next/image";
import { ApiComic } from "@/types/api";

interface ComicCardProps {
  comic: ApiComic;
  priority?: boolean;
  rank?: number;
}

export function ComicCard({ comic, priority = false, rank }: ComicCardProps) {
  // Use slug directly as ID
  const id = comic.slug;

  return (
    <Link href={`/comic/${id}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
        <Image
          src={comic.thumbnail}
          alt={comic.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          quality={90}
          unoptimized
        />
        {/* Type Badge */}
        <div className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-sm">
            {comic.type || 'Comic'}
        </div>
        
        {/* Rank Badge (Optional) */}
        {rank && (
            <div className="absolute bottom-0 left-0 bg-primary px-2 py-0.5 text-xs font-bold text-white rounded-tr-md">
               #{rank}
            </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
          {comic.title}
        </h3>
        {/* Using latest_chapter or rating if available */}
        <p className="line-clamp-1 text-xs text-gray-500">{comic.latest_chapter}</p>
      </div>
    </Link>
  );
}
