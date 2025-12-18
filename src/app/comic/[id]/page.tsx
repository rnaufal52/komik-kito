import { KomikuService } from "@/services/komiku";
import { ComicDetailClient } from "@/components/ComicDetailClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const comic = await KomikuService.getComicDetail(id);
    
    if (!comic) {
        return {
            title: "Comic Not Found",
        };
    }

    return {
        title: `${comic.title} - Komik Kito`,
        description: comic.synopsis?.slice(0, 160),
    };
}

export default async function ComicPage(props: PageProps) {
  const params = await props.params;
  
  return (
      <ComicDetailClient slug={params.id} />
  );
}
