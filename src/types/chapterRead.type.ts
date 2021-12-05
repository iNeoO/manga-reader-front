export type ChapterRead = {
  chapterId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  page: {
    id: string;
    name: string;
    number: number;
  }
  chapter: {
    id: string;
    name: string;
    number: number;
    nbPages: number;
  };
  manga: {
    id: string;
    name: string;
  };
};
