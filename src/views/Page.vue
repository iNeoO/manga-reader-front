<template>
  <img :src="`/api/pages/${pageId}`"/>
  <pagination
    :count="nbPages"
    :page="pageIndex + 1"
    @page-change="updatePagination" />
  <go-to
    :count="nbPages"
    :page="pageIndex + 1"
    @page-change="updatePagination" />
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef } from 'vue';

import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

import { key } from '@/store/index';

import Pagination from '@/components/utils/Pagination.vue';
import GoTo from '@/components/utils/GoTo.vue';

import { MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { Page } from '@/types/page.type';

export default defineComponent({
  name: 'Home',
  components: {
    Pagination,
    GoTo,
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
    const store = useStore(key);
    const router = useRouter();
    const route = useRoute();

    const manga: ComputedRef<MangaWithChapters> = computed(() => store.getters['mangaStore/manga']);
    const chapter: ComputedRef<ChapterFormated> = computed(() => store.getters['mangaStore/chapter']);

    if (!manga.value) {
      store.dispatch('mangaStore/getManga', prop.mangaId);
    }

    if (!chapter.value) {
      store.dispatch('mangaStore/getChapter', prop.chapterId);
    }

    const pageIndex: ComputedRef<number> = computed(
      () => chapter?.value?.pages?.findIndex(({ id }) => id === prop.pageId),
    );

    const nbPages: ComputedRef<number> = computed(() => (chapter.value?.pages?.length) || 10);

    const page: ComputedRef<Page> = computed(() => chapter.value.pages[pageIndex.value]);

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

    const updatePage = (pageId: string) => {
      router.push({
        name: 'page',
        params: {
          mangaId: route.params.mangaId,
          chapterId: route.params.chapterId,
          pageId,
        },
      });
    };

    const updatePagination = (index: number) => {
      const pageToGo = chapter.value.pages[index - 1];
      updatePage(pageToGo.id);
    };

    return {
      manga,
      chapter,
      page,
      nbPages,
      pageIndex,
      previousPage,
      nextPage,
      updatePagination,
    };
  },
});
</script>
