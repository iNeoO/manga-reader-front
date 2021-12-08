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

import { User } from '@/types/user.type';
import { UserMutationTypes } from '../types/mutation.type';
import { UserActionTypes } from '@/store/types/action.type';
import { RootState, UserState } from '@/store/types/state.type';
import {
  AugmentedActionContext,
  UserGetters,
  UserActions,
  UserMutations,
} from '@/store/types/userStore.type';

export const state = {
  user: null,
  isUserLoading: false,
};

export const actions: ActionTree<UserState, RootState> & UserActions = {
  [UserActionTypes.getUser]: async ({ commit }: AugmentedActionContext) => {
    commit(UserMutationTypes.SET_IS_USER_LOADING, true);
    try {
      const { data } = await axios.get('user/');
      commit(UserMutationTypes.SET_USER, data);
      commit(UserMutationTypes.SET_IS_USER_LOADING, false);
      return data;
    } catch (error) {
      commit(UserMutationTypes.SET_IS_USER_LOADING, false);
      throw error;
    }
  },
};

export const getters: GetterTree<UserState, RootState> & UserGetters = {
  'userStore/user': (state: UserState): User | null => state.user,
  'userStore/isUserLoading': (state: UserState): boolean => state.isUserLoading,
};

export const mutations: MutationTree<UserState> & UserMutations = {
  [UserMutationTypes.SET_USER](state: UserState, payload: User): void {
    state.user = payload;
  },
  [UserMutationTypes.SET_IS_USER_LOADING](state: UserState, payload: boolean): void {
    state.isUserLoading = payload;
  },
};

export type UserStore<S = UserState> = Omit<VuexStore<S>, 'getters' | 'commit' | 'dispatch'>
  & {
  commit<K extends keyof UserMutations, P extends Parameters<UserMutations[K]>[1]>(
      key: K,
      payload?: P,
      options?: CommitOptions
    ): ReturnType<UserMutations[K]>;
  } & {
  dispatch<K extends keyof UserActions>(
      key: K,
      payload?: Parameters<UserActions[K]>[1],
      options?: DispatchOptions
    ): ReturnType<UserActions[K]>;
  } & {
    getters: {
      [K in keyof UserGetters]: ReturnType<UserGetters[K]>
    };
  };

export const store: Module<UserState, RootState> = {
  state,
  getters,
  actions,
  mutations,
};
