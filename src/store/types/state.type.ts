import { User } from '@/types/user.type';
import { Manga, MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { ChapterReadFormated } from '@/types/chapterRead.type';

export type ApplicationState = {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
};

export type AuthState = {
  isLogged: boolean;
  isLoginLoading: boolean;
};

export type UserState = {
  user: User | null;
  isUserLoading: boolean;
};

export type MangaState = {
  mangas: Manga[];
  isMangasLoading: boolean,
  manga: MangaWithChapters | null;
  isMangaLoading: boolean;
  chapter: ChapterFormated | null;
  isChapterLoading: boolean
  chaptersRead: ChapterReadFormated[],
  isChaptersReadLoading: boolean,
  isPostChapterReadLoading: boolean,
  isDeleteChapterReadLoading: boolean,
};

export type RootState = {
  applicationStore: ApplicationState;
  authStore: AuthState;
  mangaStore: MangaState;
  userStore: UserState;
};
