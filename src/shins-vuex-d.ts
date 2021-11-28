import { Store } from 'vuex';
import { State as ApplicationStoreState } from '@/store/modules/applicationStore';
import { State as AuthStoreState } from '@/store/modules/authStore';
import { State as MangaStoreState } from '@/store/modules/mangaStore';
import { State as UserStoreState } from '@/store/modules/userStore';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    applicationStore: ApplicationStoreState,
    authStore: AuthStoreState,
    mangaStore: MangaStoreState,
    userStore: UserStoreState,
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
