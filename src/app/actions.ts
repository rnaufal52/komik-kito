"use server";

import { KomikuService } from "@/services/komiku";
import { ApiComic } from "@/types/api";

export async function fetchComicsAction(
  tipe: "manga" | "manhwa" | "manhua",
  page: number,
  genre: string,
  status: string,
  genre2: string = ""
): Promise<ApiComic[]> {
  try {
    const comics = await KomikuService.getAllComics(tipe, page, genre, status, genre2);
    return comics;
  } catch (error) {
    console.error("Error fetching comics:", error);
    return [];
  }
}

export async function getHomeDataAction() {
  try {
    const [
        popularManhwa,
        popularManga,
        popularManhua,
        newestManhwa,
        newestManga,
        newestManhua,
    ] = await Promise.all([
        KomikuService.getPopularComics("manhwa", 1),
        KomikuService.getPopularComics("manga", 1),
        KomikuService.getPopularComics("manhua", 1),
        KomikuService.getNewestComics("manhwa", 1),
        KomikuService.getNewestComics("manga", 1),
        KomikuService.getNewestComics("manhua", 1),
    ]);

    return {
        popularManhwa,
        popularManga,
        popularManhua,
        newestManhwa,
        newestManga,
        newestManhua,
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
}

export async function getComicDetailAction(slug: string) {
    try {
        const comic = await KomikuService.getComicDetail(slug);
        return comic;
    } catch (error) {
        console.error("Error fetching comic detail:", error);
        return null;
    }
}
