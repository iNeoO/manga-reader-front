<template>
  <div v-if="manga">
    <div class="flex justify-between mb-4 hidden sm:block">
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {{ manga.name }}
      </h2>
      <p class="text-gray-400 font-mediun mt-auto">chapters: {{ manga.chapters.length }}</p>
    </div>
    <div ref="items">
      <item
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :id="`chapter-${index + 1}`"
        :name="chapter.name"
        :image-id="chapter.coverPageId"
        :is-read="chapter.isRead"
        :to="{
          name: 'chapter',
          params: { mangaName: manga.name, chapterNumber: `${chapter.number}` } }">
        <template #legend>
          <span class="text-sm text-gray-400">
            Number of pages read: {{ chapter.countPagesRead }} / {{ chapter.count }}
          </span>
        </template>
      </item>
    </div>
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

import Item from '@/components/utils/Item.vue';

import { checkManga } from '@/utils/dataGetter';

export default defineComponent({
  name: 'Manga',
  components: {
    Item,
  },
  props: {
    mangaName: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const store = useStore();

    const manga = computed(() => store.getters['mangaStore/manga']);

    const chapters = computed(() => manga.value?.chapters);

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
      await checkManga(props.mangaName);

      if (chapters.value) {
        const indexFound = chapters.value.findIndex(
          ((chapter) => chapter.isRead),
        );

        const index = (() => {
          if (indexFound === -1) {
            return chapters.value.length;
          }
          return indexFound === 0 ? indexFound : indexFound - 1;
        })();

        const chapter = document.querySelector(`#chapter-${index}`);
        const main = document.querySelector('main');

        if (main && chapter) {
          const { top } = chapter.getBoundingClientRect();
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
      chapters,
      items,
    };
  },
});
</script>
