export type ChapterRead = {
  isRead: boolean;
  userId: string;
  chapterId: string;
  lastPageReadId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ChapterReadFormated = {
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

export type PostChapterReadPayload = {
  chapterId: string;
  isRead: boolean;
  lastPageReadId: string;
};
