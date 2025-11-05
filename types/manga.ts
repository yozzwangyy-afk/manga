export interface Manga {
  id: string;
  title: string;
  cover: string;
  description?: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
  pages: Page[];
}

export interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}
