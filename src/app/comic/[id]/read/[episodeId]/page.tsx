import { KomikuService } from "@/services/komiku";
import { notFound } from "next/navigation";
import { ReaderClient } from "@/components/ReaderClient";

interface PageProps {
  params: Promise<{ id: string; episodeId: string }>;
}

export default async function ReaderPage(props: PageProps) {
  const params = await props.params;
  const { id: comicSlug, episodeId: chapterSlug } = params;

  // Fetch chapter and comic details in parallel
  const [chapter, comic] = await Promise.all([
    KomikuService.getChapterDetail(chapterSlug),
    KomikuService.getComicDetail(comicSlug),
  ]);

  if (!chapter || !comic) {
    notFound();
  }

  // Find current chapter index
  const currentIndex = comic.chapters.findIndex((c) => c.slug === chapterSlug);
  
  // Logic for Next/Prev (Assuming chapters are list Newest -> Oldest)
  // Next Chapter (Story-wise) is usually index - 1 (Newer date)
  // Prev Chapter (Story-wise) is usually index + 1 (Older date)
  // But wait, "Next" usually means moving forward in the story (Chap 1 -> Chap 2).
  // If list is [100, 99, ... 1], and we are at 1. Next is 2 (index - 1).
  
  let nextSlug = null;
  let prevSlug = null;

  if (currentIndex !== -1) {
    // Next Chapter (Chronological Next)
    if (currentIndex > 0) {
        nextSlug = comic.chapters[currentIndex - 1].slug;
    }
    // Prev Chapter (Chronological Previous)
    if (currentIndex < comic.chapters.length - 1) {
        prevSlug = comic.chapters[currentIndex + 1].slug;
    }
  }

  return (
    <ReaderClient
      images={chapter.images}
      chapterTitle={chapter.title}
      files={comic.chapters}
      currentSlug={chapterSlug}
      comicSlug={comicSlug}
      prevSlug={prevSlug}
      nextSlug={nextSlug}
    />
  );
}
