export interface ApiComic {
  title: string;
  slug: string;
  thumbnail: string;
  latest_chapter: string;
  rating: string;
  description: string;
  type?: string; // Not in list API, but maybe needed for UI
}

export interface ComicDetail {
  title: string;
  slug: string;
  thumbnail: string;
  synopsis: string;
  info: {
    judul_komik: string;
    judul_indonesia: string;
    jenis_komik: string;
    konsep_cerita: string;
    pengarang: string;
    status: string;
    umur_pembaca: string;
    cara_baca: string;
  };
  genres: string[];
  chapters: {
    title: string;
    slug: string;
    date: string;
  }[];
}

export interface ChapterDetail {
  title: string;
  slug: string;
  images: string[];
}

export interface ApiMeta {
  page: number;
  hasNextPage: boolean;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta; // New API uses meta for pagination in list
  message?: string;
  code?: number;
}
