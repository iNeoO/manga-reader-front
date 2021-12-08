<template>
  <div class="w-full max-w-lg mx-auto overflow-hidden
    bg-white rounded-lg shadow-md dark:bg-gray-800">
    <div class="px-6 py-4">
      <h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">
        Manga reader
      </h2>

      <h3 class="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Welcome Back
      </h3>

      <p class="mt-1 text-center text-gray-500 dark:text-gray-400">Login or create account</p>

    <form @submit.prevent="loginClick">
      <div class="w-full mt-4">
        <input
          v-model="email"
          class="default-input"
          type="email"
          placeholder="Email Address"
          aria-label="Email Address" />
      </div>

      <div class="w-full mt-4">
        <input
          v-model="password"
          class="default-input"
          type="password"
          placeholder="Password"
          aria-label="Password" />
      </div>

      <div class="mt-4">
        <alert
          v-if="isWrongLogsDisplayed"
          type="warning"
          title="Warning"
          subtitle="Oups! Wrong email/password." />
      </div>

      <div class="flex items-center justify-between mt-4">
        <a
          href="#"
          class="text-sm text-gray-600 dark:text-blue-400 hover:underline">
          Forget Password?
        </a>

        <button
          class="default-btn"
          type="submit"
          :disabled="isLoginLoading || !password || !email">
          Login
        </button>

      </div>
    </form>
  </div>

  <div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
    <span class="text-sm text-gray-600 dark:text-gray-200">Don't have an account? </span>

    <a
      href="#"
      class="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline">Register</a>
  </div>
</div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  ComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';

import { useStore } from '@/store/index';

import Alert from '@/components/utils/Alert.vue';

import { AuthActionTypes, UserActionTypes } from '@/store/types/action.type';

export default defineComponent({
  name: 'login',
  components: {
    Alert,
  },
  setup() {
    const store = useStore();

    const router = useRouter();

    const email: Ref<string> = ref('');
    const password: Ref<string> = ref('');
    const isWrongLogsDisplayed: Ref<boolean> = ref(false);

    const isLoginLoading: ComputedRef<boolean> = computed(() => store.getters['authStore/isLoginLoading']);

    const loginClick = async () => {
      try {
        await store.dispatch(AuthActionTypes.login, {
          email: email.value, password: password.value,
        });
        await store.dispatch(UserActionTypes.getUser);
        isWrongLogsDisplayed.value = false;
        router.push({ name: 'home' });
      } catch (error) {
        isWrongLogsDisplayed.value = true;
      }
    };

    return {
      email,
      password,
      isWrongLogsDisplayed,
      isLoginLoading,
      loginClick,
    };
  },
});
</script>
