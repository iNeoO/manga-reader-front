import { ActionContext } from 'vuex';

import { ApplicationMutationTypes } from '@/store/types/mutation.type';

import { RootState, ApplicationState } from '@/store/types/state.type';

export type ApplicationMutations<S = ApplicationState> = {
  [ApplicationMutationTypes.SET_IS_DARK_MODE](state: S, payload: boolean): void
  [ApplicationMutationTypes.SET_IS_SIDEBAR_OPEN](state: S, payload: boolean): void
};

export type AugmentedActionContext = {
  commit<K extends keyof ApplicationMutations>(
    key: K,
    payload: Parameters<ApplicationMutations[K]>[1]
  ): ReturnType<ApplicationMutations[K]>
} & Omit<ActionContext<ApplicationState, RootState>, 'commit'>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApplicationActions {}

export type ApplicationGetters = {
  ['applicationStore/isDarkMode'](state: ApplicationState): boolean
  ['applicationStore/isSidebarOpen'](state: ApplicationState): boolean
}
