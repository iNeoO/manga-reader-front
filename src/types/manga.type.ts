import { ChapterFormated } from './chapter.type';

export type Manga = {
  id: string;
  name: string;
  coverPageId: string;
  _count?: {
    chapters: number;
  };
};

export type MangaWithChapters = Manga & {
  chapters: ChapterFormated[];
};
