<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-800 font-roboto">
    <sidebar />

    <div class="flex-1 flex flex-col overflow-hidden">

      <header-bar @open-sidebar="isSidebarOpen = true" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="container mx-auto px-6 py-8">
          <slot />
        </div>
      </main>

      <top-button window-selector="main" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from 'vue';

import { useStore } from 'vuex';

import Sidebar from '@/components/layout/logged/Sidebar.vue';
import HeaderBar from '@/components/layout/logged/HeaderBar.vue';
import TopButton from '@/components/layout/logged/TopButton.vue';

export default defineComponent({
  name: 'logged',
  components: {
    Sidebar,
    HeaderBar,
    TopButton,
  },
  setup() {
    const store = useStore();

    const isSidebarOpen = computed({
      get(): boolean {
        return store.getters['applicationStore/isSidebarOpen'];
      },
      set(value: boolean) {
        store.commit('applicationStore/SET_IS_SIDEBAR_OPEN', value);
      },
    });

    return {
      isSidebarOpen,
    };
  },
});
</script>
