import { Page } from './page.type';

export type Chapter = {
  id: string;
  name: string;
  number: number;
  coverPageId: string;
};

export type ChapterWithPages = Chapter & {
  pages: Page[];
};

export type ChapterFormated = ChapterWithPages & {
  isRead: boolean;
  count: number;
  lastPageReadId: string;
  countPagesRead?: number;
};
