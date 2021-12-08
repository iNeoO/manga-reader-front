import { ActionContext } from 'vuex';

import { MangaMutationTypes } from '@/store/types/mutation.type';
import { MangaActionTypes } from '@/store/types/action.type';

import { Manga, MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { ChapterReadFormated, ChapterRead, PostChapterReadPayload } from '@/types/chapterRead.type';

import { RootState, MangaState } from '@/store/types/state.type';

export type MangaMutations<S = MangaState> = {
  [MangaMutationTypes.SET_MANGAS](state: S, payload: Manga[]): void
  [MangaMutationTypes.SET_IS_MANGAS_LOADING](state: S, payload: boolean): void
  [MangaMutationTypes.SET_MANGA](state: S, payload: MangaWithChapters): void
  [MangaMutationTypes.SET_IS_MANGA_LOADING](state: S, payload: boolean): void
  [MangaMutationTypes.SET_CHAPTER](state: S, payload: ChapterFormated): void
  [MangaMutationTypes.SET_IS_CHAPTER_LOADING](state: S, payload: boolean): void
  [MangaMutationTypes.SET_CHAPTERS_READ](state: S, payload: ChapterReadFormated[]): void
  [MangaMutationTypes.SET_IS_CHAPTERS_READ_LOADING](state: S, payload: boolean): void
  [MangaMutationTypes.SET_IS_POST_CHAPTER_READ_LOADING](state: S, payload: boolean): void
  [MangaMutationTypes.SET_IS_DELETE_CHAPTER_READ_LOADING](state: S, payload: boolean): void
};

export type AugmentedActionContext = {
  commit<K extends keyof MangaMutations>(
    key: K,
    payload: Parameters<MangaMutations[K]>[1]
  ): ReturnType<MangaMutations[K]>
} & Omit<ActionContext<MangaState, RootState>, 'commit'>

export interface MangaActions {
  [MangaActionTypes.getMangas](
    { commit }: AugmentedActionContext,
  ): Promise<Manga[]>
  [MangaActionTypes.getManga](
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<MangaWithChapters>
  [MangaActionTypes.getChapter](
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<ChapterFormated>
  [MangaActionTypes.postChapterReading](
    { commit }: AugmentedActionContext,
    payload: PostChapterReadPayload,
  ): Promise<ChapterFormated>
  [MangaActionTypes.getChaptersRead](
    { commit }: AugmentedActionContext,
  ): Promise<ChapterReadFormated[]>
  [MangaActionTypes.deleteChapterReading](
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<ChapterRead>
}

export type MangaGetters = {
  ['mangaStore/mangas'](state: MangaState): Manga[]
  ['mangaStore/isMangasLoading'](state: MangaState): boolean
  ['mangaStore/manga'](state: MangaState): MangaWithChapters | null
  ['mangaStore/isMangaLoading'](state: MangaState): boolean
  ['mangaStore/chapter'](state: MangaState): ChapterFormated | null
  ['mangaStore/isChapterLoading'](state: MangaState): boolean
  ['mangaStore/chaptersRead'](state: MangaState): ChapterReadFormated[]
  ['mangaStore/isChaptersReadLoading'](state: MangaState): boolean
  ['mangaStore/isPostChapterReadLoading'](state: MangaState): boolean
  ['mangaStore/isDeleteChapterReadLoading'](state: MangaState): boolean
}
