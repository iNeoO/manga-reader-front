<template>
  <!-- <img :src="`/api/pages/${pageId}`"/> -->
  <pagination :count="10" :page="10" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useStore } from 'vuex';

import Pagination from '@/components/utils/Pagination.vue';

import { Manga } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';

export default defineComponent({
  name: 'Home',
  components: {
    Pagination,
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
    pageId: {
      required: true,
      type: String,
    },
  },
  setup(prop) {
    const store = useStore();

    const manga = computed(():Manga => store.getters['mangaStore/manga']);
    const chapter = computed(():ChapterFormated => store.getters['mangaStore/chapter']);

    if (!manga.value) {
      store.dispatch('mangaStore/getManga', prop.mangaId);
    }

    if (!chapter.value) {
      store.dispatch('mangaStore/getChapter', prop.chapterId);
    }

    const pageIndex = computed(
      () => chapter.value.pages.findIndex(({ id }) => id === prop.chapterId),
    );
    const page = computed(() => chapter.value.pages[pageIndex.value]);
    const previousPage = computed(
      () => (pageIndex.value > 0 ? chapter.value.pages[pageIndex.value - 1] : null),
    );
    const nextPage = computed(
      () => (
        pageIndex.value < chapter.value.pages.length - 1
          ? chapter.value.pages[pageIndex.value + 1]
          : null
      ),
    );

    return {
      manga,
      chapter,
      page,
      previousPage,
      nextPage,
    };
  },
});
</script>
