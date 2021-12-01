<template>
  <div class="table mx-auto">
    <div class="text-right">
      <button
        @click="reloadImage"
        class="inline-block text-gray-600 dark:text-gray-300
          focus:outline-none hover:scale-110 focus:animate-bounce">
        <reload-icon />
      </button>
    </div>
    <div class="relative inline-block">
      <img id="page" class="image" :src="`/api/pages/${pageId}`"/>
      <button
        class="absolute inset-y-0 w-1/4 focus:outline-none"
        :disabled="!previousPage"
        @click="goToPrevious" />
      <button
        class="absolute inset-y-0 w-1/4 right-0 focus:outline-none"
        :disabled="!nextPage"
        @click="goToNext" />
    </div>
    <div class="flex justify-between mt-4">
      <pagination
        :count="nbPages"
        :page="pageIndex + 1"
        @page-change="updatePagination" />
      <go-to
        v-if="isInited"
        ref="goToRef"
        :count="nbPages"
        :page="pageIndex + 1"
        @page-change="updatePagination" />
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
} from 'vue';

import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { key } from '@/store/index';

import Pagination from '@/components/utils/Pagination.vue';
import GoTo from '@/components/utils/GoTo.vue';
import ReloadIcon from '@/components/utils/ReloadIcon.vue';

import { checkPage } from '@/utils/dataGetter';

import { MangaWithChapters } from '@/types/manga.type';
import { ChapterFormated } from '@/types/chapter.type';
import { Page } from '@/types/page.type';

export default defineComponent({
  name: 'Home',
  components: {
    Pagination,
    GoTo,
    ReloadIcon,
  },
  props: {
    mangaName: {
      required: true,
      type: String,
    },
    chapterNumber: {
      required: true,
      type: String,
    },
    pageNumber: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const store = useStore(key);
    const router = useRouter();

    const goToRef = ref();

    const isInited: Ref<boolean> = ref(false);

    const manga: ComputedRef<MangaWithChapters> = computed(() => store.getters['mangaStore/manga']);
    const chapter: ComputedRef<ChapterFormated> = computed(() => store.getters['mangaStore/chapter']);

    const pageIndex: ComputedRef<number> = computed(
      () => chapter?.value?.pages?.findIndex(
        ({ number }) => number === parseInt(props.pageNumber, 10),
      ),
    );

    const nbPages: ComputedRef<number> = computed(() => (chapter.value?.pages?.length) || 10);

    const page: ComputedRef<Page> = computed(() => chapter.value.pages[pageIndex.value]);
    const pageId: ComputedRef<string> = computed(() => page.value.id);

    const previousPage = computed(
      () => (pageIndex.value > 0 ? chapter.value.pages[pageIndex.value - 1] : null),
    );

    const goToPrevious = () => {
      if (previousPage.value?.id) {
        router.push({
          name: 'page',
          params: {
            mangaName: props.mangaName,
            chapterNumber: props.chapterNumber,
            pageNumber: previousPage.value.number,
          },
        });
      }
    };

    const nextPage = computed(
      () => (
        pageIndex.value < chapter.value?.pages?.length - 1
          ? chapter?.value?.pages?.[pageIndex.value + 1]
          : null
      ),
    );

    const goToNext = () => {
      if (nextPage.value?.id) {
        router.push({
          name: 'page',
          params: {
            mangaName: props.mangaName,
            chapterNumber: props.chapterNumber,
            pageNumber: nextPage.value.number,
          },
        });
      }
    };

    const updatePage = (pageIdToGo: string, index: number) => {
      router.push({
        name: 'page',
        params: {
          mangaName: props.mangaName,
          chapterNumber: props.chapterNumber,
          pageNumber: index,
        },
      });
      store.dispatch('mangaStore/postChapterReading', {
        chapterId: chapter.value.id,
        isRead: !nextPage.value,
        lastPageReadId: pageIdToGo,
      });
      goToRef.value.updatePage(index);
    };

    const updatePagination = (index: number) => {
      const pageToGo = chapter.value.pages[index - 1];
      updatePage(pageToGo.id, index);
    };

    const reloadImage = () => {
      const pageImg = document.getElementById('page');
      if (pageImg) {
        const src = `/api/pages/${pageId.value}?t=${new Date().getTime()}`;
        pageImg.setAttribute('src', src);
      }
    };

    onMounted(async () => {
      await checkPage(
        props.mangaName,
        parseInt(props.chapterNumber, 10),
        parseInt(props.pageNumber, 10),
      );
      isInited.value = true;
    });

    return {
      manga,
      chapter,
      page,
      pageId,
      nbPages,
      pageIndex,
      previousPage,
      nextPage,
      updatePagination,
      goToRef,
      isInited,
      goToPrevious,
      goToNext,
      reloadImage,
    };
  },
});
</script>

<style scoped>
.image {
  max-height: 1044px;
}
</style>
