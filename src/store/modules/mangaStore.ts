import { Commit } from 'vuex';

import axios from '@/plugins/axios';
import { Manga, MangaWithChapters } from '@/types/manga.type';
import { Chapter } from '@/types/chapter.type';

export type State = {
  mangas: Manga[];
  isMangasLoading: boolean,
  manga: MangaWithChapters;
  isMangaLoading: boolean;
  chapter: Chapter;
  isChapterLoading: boolean,
  isPostChapterReadLoading: boolean,
  isDeleteChapterReadLoading: boolean,
};

const state = {
  mangas: [],
  isMangasLoading: false,
  manga: null,
  isMangaLoading: false,
  chapter: null,
  isChapterLoading: false,
  isPostChapterReadLoading: false,
  isDeleteChapterReadLoading: false,
};

const actions = {
  async getMangas(
    { commit }: { commit: Commit },
  ): Promise<Manga[]> {
    commit('SET_IS_MANGAS_LOADING', true);
    try {
      const { data }: { data: Manga[] } = await axios.get('mangas/');
      commit('SET_MANGAS', data);
      commit('SET_IS_MANGAS_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_MANGAS_LOADING', false);
      throw error;
    }
  },
  async getManga(
    { commit }: { commit: Commit },
    id: string,
  ): Promise<MangaWithChapters> {
    commit('SET_IS_MANGA_LOADING', true);
    try {
      const { data }: { data: MangaWithChapters } = await axios.get(`mangas/${id}`);
      commit('SET_MANGA', data);
      commit('SET_IS_MANGA_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_MANGA_LOADING', false);
      throw error;
    }
  },
  async getChapter(
    { commit }: { commit: Commit },
    id: string,
  ): Promise<Chapter> {
    commit('SET_IS_CHAPTER_LOADING', true);
    try {
      const { data }: { data: Chapter } = await axios.get(`chapters/${id}`);
      commit('SET_CHAPTER', data);
      commit('SET_IS_CHAPTER_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_CHAPTER_LOADING', false);
      throw error;
    }
  },
  async postChapterReading(
    { commit }: { commit: Commit },
    id: string,
  ): Promise<Chapter> {
    commit('SET_IS_POST_CHAPTER_READ_LOADING', true);
    try {
      const { data }: { data: Chapter } = await axios.post('chapters-read/', { params: { id } });
      commit('SET_CHAPTER', data);
      commit('SET_IS_POST_CHAPTER_READ_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_POST_CHAPTER_READ_LOADING', true);
      throw error;
    }
  },
  async deleteChapterReading(
    { commit }: { commit: Commit },
    id: string,
  ): Promise<Chapter> {
    commit('SET_IS_DELETE_CHAPTER_READ_LOADING', true);
    try {
      const { data } = await axios.delete('chapters-read/', { params: { id } });
      commit('SET_CHAPTER', data);
      commit('SET_IS_DELETE_CHAPTER_READ_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_DELETE_CHAPTER_READ_LOADING', true);
      throw error;
    }
  },
};

const getters = {
  mangas: (state: State): Manga[] => state.mangas,
  isMangasLoading: (state: State): boolean => state.isMangasLoading,
  manga: (state: State): MangaWithChapters => state.manga,
  isMangaLoading: (state: State): boolean => state.isMangaLoading,
  chapter: (state: State): Chapter => state.chapter,
  isChapterLoading: (state: State): boolean => state.isChapterLoading,
  isPostChapterReadLoading: (state: State): boolean => state.isPostChapterReadLoading,
  isDeleteChapterReadLoading: (state: State): boolean => state.isDeleteChapterReadLoading,
};

const mutations = {
  SET_MANGAS(state: State, mangas: Manga[]): void {
    state.mangas = mangas;
  },
  SET_IS_MANGAS_LOADING(state: State, isMangasLoading: boolean): void {
    state.isMangasLoading = isMangasLoading;
  },
  SET_MANGA(state: State, manga: MangaWithChapters): void {
    state.manga = manga;
  },
  SET_IS_MANGA_LOADING(state: State, isMangaLoading: boolean): void {
    state.isMangaLoading = isMangaLoading;
  },
  SET_CHAPTER(state: State, chapter: Chapter): void {
    state.chapter = chapter;
  },
  SET_IS_CHAPTER_LOADING(state: State, isChapterLoading: boolean): void {
    state.isChapterLoading = isChapterLoading;
  },
  SET_IS_POST_CHAPTER_READ_LOADING(state: State, isPostChapterReadLoading: boolean): void {
    state.isPostChapterReadLoading = isPostChapterReadLoading;
  },
  SET_IS_DELETE_CHAPTER_READ_LOADING(state: State, isDeleteChapterReadLoading: boolean): void {
    state.isDeleteChapterReadLoading = isDeleteChapterReadLoading;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
