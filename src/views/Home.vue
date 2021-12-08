<template>
  <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
    Mangas
  </h2>
  <div ref="items">
    <item
      v-for="manga in mangas"
      :key="manga.id"
      :name="manga.name"
      :image-id="manga.coverPageId"
      :to="{ name: 'manga', params: { mangaName: manga.name } }">
      <template #legend>
        <span class="text-sm text-gray-400">
          Number of chapters: {{ manga._count?.chapters }}
        </span>
      </template>
    </item>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';

import { useStore } from '@/store/index';

import { MangaActionTypes } from '@/store/types/action.type';

import Item from '@/components/utils/Item.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Item,
  },
  setup() {
    const store = useStore();

    const mangas = computed(() => store.getters['mangaStore/mangas']);

    const items: Ref<Element | null> = ref(null);

    let intersectionObserver: IntersectionObserver;
    let mutationObserver: MutationObserver;

    const setObserver = () => {
      if (items.value) {
        const config = {
          rootMargin: '0px 0px 50px 0px',
          threshold: 0,
        };
        if (intersectionObserver) {
          intersectionObserver.disconnect();
        }
        intersectionObserver = new IntersectionObserver((entries, self) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const src = entry.target.getAttribute('data-src');
              entry.target.setAttribute('src', `${src}`);
              self.unobserve(entry.target);
            }
          });
        }, config);

        const imgs = items.value.querySelectorAll('[data-src]');
        imgs.forEach((img: Element) => {
          intersectionObserver.observe(img);
        });
      }
    };

    let debouncedFunctionTimeout: number;

    const debouncedFunction = () => {
      clearTimeout(debouncedFunctionTimeout);
      debouncedFunctionTimeout = setTimeout(() => {
        setObserver();
      }, 300);
    };

    onMounted(async () => {
      await store.dispatch(MangaActionTypes.getMangas);
      if (items.value) {
        const config = { childList: true };

        mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              debouncedFunction();
            }
          });
        });
        mutationObserver.observe(items.value, config);
        debouncedFunction();
      }
    });

    onBeforeUnmount(() => {
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      clearTimeout(debouncedFunctionTimeout);
    });

    return {
      mangas,
      items,
    };
  },
});
</script>
