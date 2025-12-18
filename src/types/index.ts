export interface Comic {
  id: number;
  title: string;
  author: string;
  genre: string;
  image: string;
  synopsis: string;
  likes?: string;
}

export interface Episode {
  id: number;
  comicId: number;
  thumbnail: string;
  title: string;
  date: string;
  likes: string;
}
