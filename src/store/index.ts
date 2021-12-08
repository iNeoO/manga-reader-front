import {
  createStore,
} from 'vuex';
import { store as applicationStore, ApplicationStore } from '@/store/modules/applicationStore';
import { store as authStore, AuthStore } from '@/store/modules/authStore';
import { store as mangaStore, MangaStore } from '@/store/modules/mangaStore';
import { store as userStore, UserStore } from '@/store/modules/userStore';

import { RootState } from '@/store/types/state.type';

export type Store = ApplicationStore<Pick<RootState, 'applicationStore'>>
  & AuthStore<Pick<RootState, 'authStore'>>
  & MangaStore<Pick<RootState, 'mangaStore'>>
  & UserStore<Pick<RootState, 'userStore'>>;

export const store = createStore({
  modules: {
    applicationStore,
    authStore,
    mangaStore,
    userStore,
  },
});

export function useStore(): Store {
  return store as Store;
}
