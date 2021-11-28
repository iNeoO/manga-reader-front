import { Commit } from 'vuex';
import axios from '@/plugins/axios';
import { User } from '@/types/user.type';

export type State = {
  user: User;
  isUserLoading: boolean;
  isPatchPageHistory: boolean;
  isResetPageHistory: boolean;
};

const state = {
  user: {},
  isUserLoading: false,
  isPatchPageHistory: false,
  isResetPageHistory: false,
};

const actions = {
  async getUser(
    { commit }: { commit: Commit },
  ): Promise<User> {
    commit('SET_IS_USER_LOADING', true);
    try {
      const { data } = await axios.get('user/');
      commit('SET_USER', data);
      commit('SET_IS_USER_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_USER_LOADING', false);
      throw error;
    }
  },
  async patchPageHistory(
    { commit }: { commit: Commit },
    params: { [key: string]: string },
  ): Promise<User> {
    commit('SET_IS_PATCH_PAGE_HISTORY_LOADING', true);
    try {
      const { data } = await axios.patch('user/page-history/', { params });
      commit('SET_USER', data);
      commit('SET_IS_PATCH_PAGE_HISTORY_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_PATCH_PAGE_HISTORY_LOADING', false);
      throw error;
    }
  },
  async deletePageHistory(
    { commit }: { commit: Commit },
  ): Promise<User> {
    commit('SET_IS_RESET_PAGE_HISTORY_LOADING', true);
    try {
      const { data } = await axios.post('user/reset-page-history/');
      commit('SET_USER', data);
      commit('SET_IS_RESET_PAGE_HISTORY_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_RESET_PAGE_HISTORY_LOADING', false);
      throw error;
    }
  },
};

const getters = {
  user: (state: State): User => state.user,
  isUserLoading: (state: State): boolean => state.isUserLoading,
  isPatchPageHistory: (state: State): boolean => state.isPatchPageHistory,
  isResetPageHistory: (state: State): boolean => state.isResetPageHistory,
};

const mutations = {
  SET_USER(state: State, user: User): void {
    state.user = user;
  },
  SET_IS_USER_LOADING(state: State, isUserLoading: boolean): void {
    state.isUserLoading = isUserLoading;
  },
  SET_IS_PATCH_PAGE_HISTORY_LOADING(state: State, isPatchPageHistory: boolean): void {
    state.isPatchPageHistory = isPatchPageHistory;
  },
  SET_IS_RESET_PAGE_HISTORY_LOADING(state: State, isResetPageHistory: boolean): void {
    state.isResetPageHistory = isResetPageHistory;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
