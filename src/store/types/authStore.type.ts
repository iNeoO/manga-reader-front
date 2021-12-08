import { ActionContext } from 'vuex';

import { AuthMutationTypes } from '@/store/types/mutation.type';
import { AuthActionTypes } from '@/store/types/action.type';
import { LoginReturn, LoginForm } from '@/types/auth.type';

import { RootState, AuthState } from '@/store/types/state.type';

export type AuthMutations<S = AuthState> = {
  [AuthMutationTypes.SET_IS_LOGGED](state: S, payload: boolean): void
  [AuthMutationTypes.SET_IS_LOGIN_LOADING](state: S, payload: boolean): void
};

export type AugmentedActionContext = {
  commit<K extends keyof AuthMutations>(
    key: K,
    payload: Parameters<AuthMutations[K]>[1]
  ): ReturnType<AuthMutations[K]>
} & Omit<ActionContext<AuthState, RootState>, 'commit'>

export interface AuthActions {
  [AuthActionTypes.login](
    { commit }: AugmentedActionContext,
    payload: LoginForm,
  ): Promise<LoginReturn>
}

export type AuthGetters = {
  ['authStore/isLogged'](state: AuthState): boolean
  ['authStore/isLoginLoading'](state: AuthState): boolean
}
