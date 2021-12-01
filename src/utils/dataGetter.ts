import { AxiosError } from 'axios';

import { store } from '@/store';
import router from '@/router';

import { Manga, MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { Page } from '@/types/page.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAxiosError = (candidate: any): candidate is AxiosError => candidate.isAxiosError === true;

export const checkMangas = async (): Promise<Manga[]> => {
  const mangas: Manga[] = store.getters['mangaStore/mangas'];
  if (!mangas.length) {
    return store.dispatch('mangaStore/getMangas');
  }
  return mangas;
};

export const checkManga = async (mangaName: string): Promise<MangaWithChapters> => {
  const mangas: Manga[] = await checkMangas();

  const manga: MangaWithChapters = store.getters['mangaStore/manga'];

  if (manga && manga.id) {
    return manga;
  }

  const mangaId = mangas.find(
    (m) => m.name.toLowerCase() === mangaName.toLowerCase(),
  )?.id;

  if (!mangaId) {
    router.push({ name: 'home' });
    throw new Error('Manga not found in store');
  }

  try {
    return store.dispatch('mangaStore/getManga', mangaId);
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
  const manga: MangaWithChapters = await checkManga(mangaName);

  const chapter: ChapterFormated = store.getters['mangaStore/chapter'];

  if (chapter && chapter.id) {
    return chapter;
  }

  const chapterId = manga.chapters.find(
    (c) => c.number === chapterNumber,
  )?.id;

  if (!chapterId) {
    router.push({ name: 'manga', params: { mangaName } });
    throw new Error('Chapter not found in store');
  }

  try {
    return store.dispatch('mangaStore/getChapter', chapterId);
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
  const chapter: ChapterFormated = await checkChapter(mangaName, chapterNumber);

  const page = chapter.pages.find(
    (c) => c.number === pageNumber,
  );

  if (!page) {
    router.push({ name: 'chapters', params: { mangaName, pageNumber } });
    throw new Error('Page not found in store');
  }

  return page;
};
