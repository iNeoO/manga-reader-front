import Cookies from 'js-cookie';
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

import { AuthMutationTypes } from '@/store/types/mutation.type';
import { AuthActionTypes } from '@/store/types/action.type';

import { RootState, AuthState } from '@/store/types/state.type';
import {
  AugmentedActionContext,
  AuthGetters,
  AuthActions,
  AuthMutations,
} from '@/store/types/authStore.type';
import { LoginReturn, LoginForm } from '@/types/auth.type';

export const state = {
  isLogged: false,
  isLoginLoading: false,
};

export const actions: ActionTree<AuthState, RootState> & AuthActions = {
  [AuthActionTypes.login]: async ({ commit }: AugmentedActionContext, payload: LoginForm) => {
    commit(AuthMutationTypes.SET_IS_LOGIN_LOADING, true);
    try {
      const { data }: { data: LoginReturn } = await axios.post('auth/login/', payload);
      commit(AuthMutationTypes.SET_IS_LOGGED, true);
      Cookies.set(
        process.env.VUE_APP_COOKIE_TOKEN_NAME,
        data.access_token,
        {
          expires: +process.env.VUE_APP_COOKIE_TOKEN_DURATION,
          secure: true,
        },
      );
      commit(AuthMutationTypes.SET_IS_LOGIN_LOADING, false);
      return data;
    } catch (error) {
      commit(AuthMutationTypes.SET_IS_LOGGED, false);
      commit(AuthMutationTypes.SET_IS_LOGIN_LOADING, false);
      throw error;
    }
  },
};

export const getters: GetterTree<AuthState, RootState> & AuthGetters = {
  'authStore/isLogged': (state: AuthState): boolean => state.isLogged,
  'authStore/isLoginLoading': (state: AuthState): boolean => state.isLoginLoading,
};

export const mutations: MutationTree<AuthState> & AuthMutations = {
  [AuthMutationTypes.SET_IS_LOGGED](state: AuthState, payload: boolean): void {
    state.isLogged = payload;
  },
  [AuthMutationTypes.SET_IS_LOGIN_LOADING](state: AuthState, payload: boolean): void {
    state.isLoginLoading = payload;
  },
};

export type AuthStore<S = AuthState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
  & {
  commit<K extends keyof AuthMutations, P extends Parameters<AuthMutations[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<AuthMutations[K]>;
  } & {
  dispatch<K extends keyof AuthActions>(
      key: K,
      payload?: Parameters<AuthActions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<AuthActions[K]>;
  } & {
    getters: {
      [K in keyof AuthGetters]: ReturnType<AuthGetters[K]>
    };
  };

export const store: Module<AuthState, RootState> = {
  state,
  getters,
  actions,
  mutations,
};
