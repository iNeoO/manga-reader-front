import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  MutationTree,
  ActionTree,
  GetterTree,
  Module,
} from 'vuex';
import axios from '@/plugins/axios';

import { Manga, MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { ChapterRead, ChapterReadFormated, PostChapterReadPayload } from '@/types/chapterRead.type';

import { MangaMutationTypes } from '../types/mutation.type';
import { MangaActionTypes } from '@/store/types/action.type';

import { RootState, MangaState } from '@/store/types/state.type';
import {
  AugmentedActionContext,
  MangaGetters,
  MangaActions,
  MangaMutations,
} from '@/store/types/mangaStore.type';

export const state = {
  mangas: [],
  isMangasLoading: false,
  manga: null,
  isMangaLoading: false,
  chapter: null,
  isChapterLoading: false,
  chaptersRead: [],
  isChaptersReadLoading: false,
  isPostChapterReadLoading: false,
  isDeleteChapterReadLoading: false,
};

export const actions: ActionTree<MangaState, RootState> & MangaActions = {
  [MangaActionTypes.getMangas]: async (
    { commit }: AugmentedActionContext,
  ): Promise<Manga[]> => {
    commit(MangaMutationTypes.SET_IS_MANGAS_LOADING, true);
    try {
      const { data }: { data: Manga[] } = await axios.get('mangas/');
      commit(MangaMutationTypes.SET_MANGAS, data);
      commit(MangaMutationTypes.SET_IS_MANGAS_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_MANGAS_LOADING, false);
      throw error;
    }
  },
  [MangaActionTypes.getManga]: async (
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<MangaWithChapters> => {
    commit(MangaMutationTypes.SET_IS_MANGAS_LOADING, true);
    try {
      const { data }: { data: MangaWithChapters } = await axios.get(`mangas/${payload}`);
      commit(MangaMutationTypes.SET_MANGA, data);
      commit(MangaMutationTypes.SET_IS_MANGA_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_MANGA_LOADING, false);
      throw error;
    }
  },
  [MangaActionTypes.getChapter]: async (
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<ChapterFormated> => {
    commit(MangaMutationTypes.SET_IS_CHAPTER_LOADING, true);
    try {
      const { data }: { data: ChapterFormated } = await axios.get(`chapters/${payload}`);
      commit(MangaMutationTypes.SET_CHAPTER, data);
      commit(MangaMutationTypes.SET_IS_CHAPTER_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_CHAPTER_LOADING, false);
      throw error;
    }
  },
  [MangaActionTypes.postChapterReading]: async (
    { commit }: AugmentedActionContext,
    payload: PostChapterReadPayload,
  ): Promise<ChapterFormated> => {
    commit(MangaMutationTypes.SET_IS_POST_CHAPTER_READ_LOADING, true);
    try {
      const { data }: { data: ChapterFormated } = await axios.post('chapters-read/', payload);
      commit(MangaMutationTypes.SET_CHAPTER, data);
      commit(MangaMutationTypes.SET_IS_POST_CHAPTER_READ_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_POST_CHAPTER_READ_LOADING, false);
      throw error;
    }
  },
  [MangaActionTypes.getChaptersRead]: async (
    { commit }: AugmentedActionContext,
  ): Promise<ChapterReadFormated[]> => {
    commit(MangaMutationTypes.SET_IS_CHAPTERS_READ_LOADING, true);
    try {
      const { data }: { data: ChapterReadFormated[] } = await axios.get('chapters-read/');
      commit(MangaMutationTypes.SET_CHAPTERS_READ, data);
      commit(MangaMutationTypes.SET_IS_CHAPTERS_READ_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_CHAPTERS_READ_LOADING, false);
      throw error;
    }
  },
  [MangaActionTypes.deleteChapterReading]: async (
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<ChapterRead> => {
    commit(MangaMutationTypes.SET_IS_DELETE_CHAPTER_READ_LOADING, true);
    try {
      const { data }: { data: ChapterRead } = await axios.delete(`chapters-read/${payload}`);
      commit(MangaMutationTypes.SET_IS_DELETE_CHAPTER_READ_LOADING, false);
      return data;
    } catch (error) {
      commit(MangaMutationTypes.SET_IS_DELETE_CHAPTER_READ_LOADING, false);
      throw error;
    }
  },
};

export const getters: GetterTree<MangaState, RootState> & MangaGetters = {
  'mangaStore/mangas': (state: MangaState): Manga[] => state.mangas,
  'mangaStore/isMangasLoading': (state: MangaState): boolean => state.isMangasLoading,
  'mangaStore/manga': (state: MangaState): MangaWithChapters | null => state.manga,
  'mangaStore/isMangaLoading': (state: MangaState): boolean => state.isMangaLoading,
  'mangaStore/chapter': (state: MangaState): ChapterFormated | null => state.chapter,
  'mangaStore/isChapterLoading': (state: MangaState): boolean => state.isChapterLoading,
  'mangaStore/chaptersRead': (state: MangaState): ChapterReadFormated[] => state.chaptersRead,
  'mangaStore/isChaptersReadLoading': (state: MangaState): boolean => state.isChaptersReadLoading,
  'mangaStore/isPostChapterReadLoading': (state: MangaState): boolean => state.isPostChapterReadLoading,
  'mangaStore/isDeleteChapterReadLoading': (state: MangaState): boolean => state.isDeleteChapterReadLoading,
};

export const mutations: MutationTree<MangaState > & MangaMutations = {
  [MangaMutationTypes.SET_MANGAS](state: MangaState, payload: Manga[]): void {
    state.mangas = payload;
  },
  [MangaMutationTypes.SET_IS_MANGAS_LOADING](state: MangaState, payload: boolean): void {
    state.isMangasLoading = payload;
  },
  [MangaMutationTypes.SET_MANGA](state: MangaState, payload: MangaWithChapters): void {
    state.manga = payload;
  },
  [MangaMutationTypes.SET_IS_MANGA_LOADING](state: MangaState, payload: boolean): void {
    state.isMangaLoading = payload;
  },
  [MangaMutationTypes.SET_CHAPTER](state: MangaState, payload: ChapterFormated): void {
    state.chapter = payload;
  },
  [MangaMutationTypes.SET_IS_CHAPTER_LOADING](state: MangaState, payload: boolean): void {
    state.isChapterLoading = payload;
  },
  [MangaMutationTypes.SET_CHAPTERS_READ](state: MangaState, payload: ChapterReadFormated[]): void {
    state.chaptersRead = payload;
  },
  [MangaMutationTypes.SET_IS_CHAPTERS_READ_LOADING](state: MangaState, payload: boolean): void {
    state.isChaptersReadLoading = payload;
  },
  [MangaMutationTypes.SET_IS_POST_CHAPTER_READ_LOADING](state: MangaState, payload: boolean): void {
    state.isPostChapterReadLoading = payload;
  },
  [
  MangaMutationTypes.SET_IS_DELETE_CHAPTER_READ_LOADING
  ](state: MangaState, payload: boolean): void {
    state.isDeleteChapterReadLoading = payload;
  },
};

export type MangaStore<S = MangaState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
  & {
  commit<K extends keyof MangaMutations, P extends Parameters<MangaMutations[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<MangaMutations[K]>;
  } & {
  dispatch<K extends keyof MangaActions>(
      key: K,
      payload?: Parameters<MangaActions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<MangaActions[K]>;
  } & {
    getters: {
      [K in keyof MangaGetters]: ReturnType<MangaGetters[K]>
    };
  };

export const store: Module<MangaState, RootState> = {
  state,
  getters,
  actions,
  mutations,
};
