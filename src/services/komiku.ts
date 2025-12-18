import { ApiComic, ApiResponse, ComicDetail, ChapterDetail } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const KomikuService = {
  async getAllComics(
     tipe: "manga" | "manhwa" | "manhua" = "manhwa", 
     page: number = 1,
     genre: string = "",
     status: string = "",
     genre2: string = ""
  ): Promise<ApiComic[]> {
    try {
        const res = await fetch(`${BASE_URL}/list?tipe=${tipe}&page=${page}&genre=${genre}&status=${status}&genre2=${genre2}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json: ApiResponse<ApiComic[]> = await res.json();
        const comics = json.data || [];
        // Inject type into comics since list API doesn't return it
        return comics.map(c => ({ ...c, type: tipe.toUpperCase() }));
    } catch (e) {
        console.error("Failed to fetch all comics:", e);
        return [];
    }
  },

  async getPopularComics(tipe: "manga" | "manhwa" | "manhua" = "manhwa", page: number = 1): Promise<ApiComic[]> {
     try {
        const res = await fetch(`${BASE_URL}/popular?tipe=${tipe}&page=${page}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json: ApiResponse<ApiComic[]> = await res.json();
        const comics = json.data || [];
        return comics.map(c => ({ ...c, type: tipe.toUpperCase() }));
     } catch (e) {
        console.error("Failed to fetch popular comics:", e);
        return [];
     }
  },

  // Note: There is no specific "recommended" endpoint in the new API.
  // We can reuse popular or just return a subset. For now, let's use popular with a different type or page.
  async getRecommendedComics(page: number = 1): Promise<ApiComic[]> {
      try {
        // Fetching Manhua as recommended for variety, or just generic popular
        const res = await fetch(`${BASE_URL}/popular?tipe=manhua&page=${page}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json: ApiResponse<ApiComic[]> = await res.json();
        const comics = json.data || [];
        return comics.map(c => ({ ...c, type: "MANHUA" }));
      } catch (e) {
        console.error("Failed to fetch recommended comics:", e);
        return [];
      }
  },

  async getNewestComics(tipe: "manga" | "manhwa" | "manhua" = "manhwa", page: number = 1): Promise<ApiComic[]> {
      try {
        const res = await fetch(`${BASE_URL}/newest?tipe=${tipe}&page=${page}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json: ApiResponse<ApiComic[]> = await res.json();
        const comics = json.data || [];
        return comics.map(c => ({ ...c, type: tipe.toUpperCase() }));
      } catch (e) {
        console.error("Failed to fetch newest comics:", e);
        return [];
      }
  },

  async searchComics(query: string): Promise<ApiComic[]> {
    try {
        const res = await fetch(`${BASE_URL}/search?s=${query}`, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json: ApiResponse<ApiComic[]> = await res.json();
        return json.data || [];
    } catch (e) {
        console.error("Failed to search comics:", e);
        return [];
    }
  },

  async getComicDetail(slug: string): Promise<ComicDetail | null> {
    try {
        const res = await fetch(`${BASE_URL}/comic/${slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        const json: ApiResponse<ComicDetail> = await res.json();
        return json.data || null;
    } catch (e) {
        console.error(`Failed to fetch comic detail for ${slug}:`, e);
        return null;
    }
  },

  async getChapterDetail(slug: string): Promise<ChapterDetail | null> {
      try {
          const res = await fetch(`${BASE_URL}/chapter/${slug}`, { next: { revalidate: 3600 } });
          if (!res.ok) return null;
          const json: ApiResponse<ChapterDetail> = await res.json();
          return json.data || null;
      } catch (e) {
          console.error(`Failed to fetch chapter detail for ${slug}:`, e);
          return null;
      }
  },

  async getGenres(): Promise<string[]> {
    try {
        const res = await fetch(`${BASE_URL}/genres`, { next: { revalidate: 86400 } }); // Cache for 24h
        if (!res.ok) return [];
        const json: ApiResponse<string[]> = await res.json();
        return json.data || [];
    } catch (e) {
        console.error("Failed to fetch genres:", e);
        return [];
    }
  }
};
