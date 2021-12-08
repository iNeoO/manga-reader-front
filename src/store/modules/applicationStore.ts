import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  MutationTree,
  ActionTree,
  GetterTree,
  Module,
} from 'vuex';

import { ApplicationMutationTypes } from '@/store/types/mutation.type';

import { RootState, ApplicationState } from '@/store/types/state.type';
import {
  ApplicationGetters,
  ApplicationMutations,
  ApplicationActions,
} from '@/store/types/applicationStore.type';

export const state = {
  isDarkMode: !!localStorage.getItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY),
  isSidebarOpen: false,
};

if (localStorage.getItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY)) {
  document.body.classList.add('dark');
} else {
  document.body.classList.remove('dark');
}

export const actions: ActionTree<ApplicationState, RootState> = {};

export const getters: GetterTree<ApplicationState, RootState> & ApplicationGetters = {
  'applicationStore/isDarkMode': (state: ApplicationState): boolean => state.isDarkMode,
  'applicationStore/isSidebarOpen': (state: ApplicationState): boolean => state.isSidebarOpen,
};

export const mutations: MutationTree<ApplicationState> & ApplicationMutations = {
  [ApplicationMutationTypes.SET_IS_DARK_MODE](state: ApplicationState, payload: boolean): void {
    if (payload) {
      localStorage.setItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY, 'true');
      document.body.classList.add('dark');
    } else {
      localStorage.removeItem(process.env.VUE_APP_STORAGE_DARK_THEME_KEY);
      document.body.classList.remove('dark');
    }
    state.isDarkMode = payload;
  },
  [ApplicationMutationTypes.SET_IS_SIDEBAR_OPEN](state: ApplicationState, payload: boolean): void {
    state.isSidebarOpen = payload;
  },
};

export type ApplicationStore<S = ApplicationState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
  & {
  commit<K extends keyof ApplicationMutations, P extends Parameters<ApplicationMutations[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<ApplicationMutations[K]>;
  } & {
  dispatch<K extends keyof ApplicationActions>(
      key: K,
      payload?: Parameters<ApplicationActions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<ApplicationActions[K]>;
  } & {
    getters: {
      [K in keyof ApplicationGetters]: ReturnType<ApplicationGetters[K]>
    };
  };

export const store: Module<ApplicationState, RootState> = {
  state,
  getters,
  actions,
  mutations,
};
