<template>
  <header class="flex justify-between items-center p-6 shadow">
    <div class="flex items-center space-x-4 lg:space-x-0">
      <button @click="isSidebarOpen = true"
        class="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <div class="flex items-center space-x-4">
      <button @click="isDarkMode = !isDarkMode"
        class="flex text-gray-600 dark:text-gray-300 focus:outline-none">
        <svg v-if="isDarkMode" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <!-- eslint-disable-next-line max-len -->
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            fill-rule="evenodd"
            clip-rule="evenodd" />
        </svg>
        <svg v-else class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
      <div class="relative">
        <button @click.stop="openDropdown"
          ref="usermenu"
          class="flex items-center space-x-2 relative focus:outline-none">
          <h2 class="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">
            {{ name }}
          </h2>
        </button>
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md
          overflow-hidden shadow-xl z-10"
          v-show="isDropdownOpen">
          <router-link :to="{name: 'profile' }"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
            Profile
          </router-link>
          <a @click="logout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white">
            Logout
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Cookies from 'js-cookie';
import {
  defineComponent,
  computed,
  ref,
} from 'vue';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import sun from '@/assets/sun.svg';
import moon from '@/assets/moon.svg';

export default defineComponent({
  name: 'loggedHeaderBar',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isSidebarOpen = computed({
      get(): boolean {
        return store.getters['applicationStore/isSidebarOpen'];
      },
      set(value: boolean) {
        store.commit('applicationStore/SET_IS_SIDEBAR_OPEN', value);
      },
    });

    const isDarkMode = computed({
      get(): boolean {
        return store.getters['applicationStore/isDarkMode'];
      },
      set(value: boolean) {
        store.commit('applicationStore/SET_IS_DARK_MODE', value);
      },
    });

    const icon = computed(() => (isDarkMode.value ? sun : moon));

    const name = computed(() => store.getters['userStore/user'].username);

    const usermenu = ref();

    const isDropdownOpen = ref(false);

    const openDropdown = () => {
      isDropdownOpen.value = true;
      const eventClick = (event: Event) => {
        if (!usermenu.value.contains(event.target)) {
          isDropdownOpen.value = false;
        }
        document.removeEventListener('click', eventClick);
      };
      document.addEventListener('click', eventClick);
    };

    const logout = () => {
      store.commit('authStore/SET_IS_LOGGED', false);
      Cookies.remove(process.env.VUE_APP_COOKIE_TOKEN_NAME);
      router.push({ name: 'login' });
    };

    return {
      isSidebarOpen,
      icon,
      isDarkMode,
      name,
      usermenu,
      isDropdownOpen,
      openDropdown,
      logout,
    };
  },
});
</script>
