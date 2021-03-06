import { AxiosError } from 'axios';

import { useStore } from '@/store';
import router from '@/router';

import { MangaActionTypes } from '@/store/types/action.type';
import { Page } from '@/types/page.type';
import { ChapterFormated } from '@/types/chapter.type';
import { Manga, MangaWithChapters } from '@/types/manga.type';

const store = useStore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (candidate: any): candidate is AxiosError => candidate.isAxiosError === true;

export const checkMangas = async (): Promise<Manga[]> => {
  const mangas = store.getters['mangaStore/mangas'];
  if (!mangas.length) {
    return store.dispatch(MangaActionTypes.getMangas);
  }
  return mangas;
};

export const checkManga = async (mangaName: string): Promise<MangaWithChapters> => {
  const mangas = await checkMangas();

  const mangaId = mangas.find(
    (m) => m.name.toLowerCase() === mangaName.toLowerCase(),
  )?.id;

  if (!mangaId) {
    router.push({ name: 'home' });
    throw new Error('Manga not found in store');
  }

  try {
    return store.dispatch(MangaActionTypes.getManga, mangaId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      router.push({ name: 'home' });
      throw new Error('Manga not found in db');
    } else {
      throw error;
    }
  }
};

export const checkChapter = async (
  mangaName: string,
  chapterNumber: number,
): Promise<ChapterFormated> => {
  const manga = await checkManga(mangaName);

  const chapterId = manga.chapters.find(
    (c) => c.number === chapterNumber,
  )?.id;

  if (!chapterId) {
    router.push({ name: 'manga', params: { mangaName } });
    throw new Error('Chapter not found in store');
  }

  try {
    return store.dispatch(MangaActionTypes.getChapter, chapterId);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      router.push({ name: 'manga', params: { mangaName } });
      throw new Error('Chapter not found in db');
    } else {
      throw error;
    }
  }
};

export const checkPage = async (
  mangaName: string,
  chapterNumber: number,
  pageNumber: number,
): Promise<Page> => {
  const chapter = await checkChapter(mangaName, chapterNumber);

  const page = chapter.pages.find(
    (c) => c.number === pageNumber,
  );

  if (!page) {
    router.push({ name: 'chapters', params: { mangaName, pageNumber } });
    throw new Error('Page not found in store');
  }

  return page;
};
