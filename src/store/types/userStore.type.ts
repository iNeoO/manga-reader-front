import { ActionContext } from 'vuex';

import { User } from '@/types/user.type';
import { UserMutationTypes } from '@/store/types/mutation.type';
import { UserActionTypes } from '@/store/types/action.type';

import { RootState, UserState } from '@/store/types/state.type';

export type UserMutations<S = UserState> = {
  [UserMutationTypes.SET_USER](state: S, payload: User): void
  [UserMutationTypes.SET_IS_USER_LOADING](state: S, payload: boolean): void
};

export type AugmentedActionContext = {
  commit<K extends keyof UserMutations>(
    key: K,
    payload: Parameters<UserMutations[K]>[1]
  ): ReturnType<UserMutations[K]>
} & Omit<ActionContext<UserState, RootState>, 'commit'>

export interface UserActions {
  [UserActionTypes.getUser](
    { commit }: AugmentedActionContext,
  ): Promise<User>
}

export type UserGetters = {
  ['userStore/user'](state: UserState): User | null
  ['userStore/isUserLoading'](state: UserState): boolean
}
