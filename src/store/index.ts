import { createStore } from 'vuex';

import stores from '@/store/modules/index';
import { State as ApplicationStoreState } from '@/store/modules/applicationStore';
import { State as AuthStoreState } from '@/store/modules/authStore';
import { State as MangaStoreState } from '@/store/modules/mangaStore';
import { State as UserStoreState } from '@/store/modules/userStore';

export interface State {
  applicationStore: ApplicationStoreState,
  authStore: AuthStoreState,
  mangaStore: MangaStoreState,
  userStore: UserStoreState,
}

export default createStore<State>({
  modules: stores,
});
