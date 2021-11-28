import Cookies from 'js-cookie';
import { Commit } from 'vuex';
import axios from '@/plugins/axios';

export type State = {
  isLogged: boolean;
  isLoginLoading: boolean;
};

type LoginReturn = {
  access_token: string,
}

const state = {
  isLogged: false,
  isLoginLoading: false,
};

const actions = {
  async login(
    { commit }: { commit: Commit },
    form: { email: string, password: string },
  ): Promise<LoginReturn> {
    commit('SET_IS_LOGIN_LOADING', true);
    try {
      const { data } = await axios.post('auth/login/', form);
      commit('SET_IS_LOGGED', true);
      Cookies.set(
        process.env.VUE_APP_COOKIE_TOKEN_NAME,
        data.access_token,
        {
          expires: +process.env.VUE_APP_COOKIE_TOKEN_DURATION,
          secure: true,
        },
      );
      commit('SET_IS_LOGIN_LOADING', false);
      return data;
    } catch (error) {
      commit('SET_IS_LOGGED', false);
      commit('SET_IS_LOGIN_LOADING', false);
      throw error;
    }
  },
};

const getters = {
  isLogged: (state: State): boolean => state.isLogged,
  isLoginLoading: (state: State): boolean => state.isLoginLoading,
};

const mutations = {
  SET_IS_LOGGED(state: State, isLogged: boolean): void {
    state.isLogged = isLogged;
  },
  SET_IS_LOGIN_LOADING(state: State, isLoginLoading: boolean): void {
    state.isLoginLoading = isLoginLoading;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
