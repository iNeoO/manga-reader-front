<template>
  <div v-if="manga && chapter">
    <div class="flex justify-between mb-4">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {{ manga.name }} <span class="text-base">/ {{ chapter.name }}</span>
      </h2>
      <p class="text-gray-400 font-mediun mt-auto">chapters: {{ manga.chapters.length }}</p>
    </div>
    <div ref="items">
      <item
        v-for="(page, index) in pages"
        :key="page.id"
        :id="`page-${index}`"
        :name="`Page: ${page.number}`"
        :image-id="page.id"
        :is-read="page.isRead"
        :to="{
          name: 'page',
          params: {
            mangaId: manga.id,
            chapterId: chapter.id,
            pageId: page.id,
          },
        }">
          <template #legend>
            <div class="text-sm text-gray-400">Page: {{ page.number }} / {{ pages.length }}</div>
          </template>
      </item>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';

import { useStore } from 'vuex';

import { key } from '@/store/index';

import Item from '@/components/utils/Item.vue';

import { MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';

export default defineComponent({
  name: 'Home',
  components: {
    Item,
  },
  props: {
    mangaId: {
      required: true,
      type: String,
    },
    chapterId: {
      required: true,
      type: String,
    },
  },
  setup(prop) {
    const store = useStore(key);

    const manga: ComputedRef<MangaWithChapters> = computed(() => store.getters['mangaStore/manga']);
    const chapter: ComputedRef<ChapterFormated> = computed(() => store.getters['mangaStore/chapter']);

    if (!manga.value) {
      store.dispatch('mangaStore/getManga', prop.mangaId);
    }

    store.dispatch('mangaStore/getChapter', prop.chapterId);

    const items: Ref<Element | null> = ref(null);

    const pages = computed(() => chapter.value.pages);

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
      if (!manga.value) {
        store.dispatch('mangaStore/getManga', prop.mangaId);
      }

      await store.dispatch('mangaStore/getChapter', prop.chapterId);

      if (chapter.value.lastPageReadId) {
        const index = pages.value.findIndex((page) => page.id === chapter.value.lastPageReadId);

        const page = document.querySelector(`#page-${index}`);
        const main = document.querySelector('main');

        if (main && page) {
          const { top } = page.getBoundingClientRect();
          main.scrollTo({
            top,
            behavior: 'auto',
          });
        }
      }

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
      manga,
      chapter,
      pages,
      items,
    };
  },
});
</script>
