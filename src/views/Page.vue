<template>
  <div class="table mx-auto">
    <div class="flex justify-between mb-2">
      <div>
        <router-link
          v-if="!isLastChapter"
          class="text-gray-700 dark:text-gray-300
            underline
            hover:text-indigo-500
            dark:hover:text-indigo-500"
          :to="{
            name: 'page',
            params: {
              mangaName: mangaName,
              chapterNumber: parseInt(chapterNumber, 10) + 1,
              pageNumber: 1,
            },
          }">
          <span>Go To next chapter</span>
        </router-link>
      </div>
      <button
        @click="reloadImage"
        class="inline-block text-gray-700 dark:text-gray-300
          hover:text-indigo-500
          dark:hover:text-indigo-500
          hover:animate-spin">
        <reload-icon />
      </button>
    </div>
    <div class="relative inline-block">
      <img v-if="pageId" id="page" class="image" :src="`/api/pages/${pageId}`"/>
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
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
} from 'vue';

import { useRouter } from 'vue-router';

import { useStore } from '@/store/index';

import Pagination from '@/components/utils/Pagination.vue';
import GoTo from '@/components/utils/GoTo.vue';
import ReloadIcon from '@/components/utils/ReloadIcon.vue';

import { checkPage } from '@/utils/dataGetter';

import { MangaActionTypes } from '@/store/types/action.type';

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
    const store = useStore();
    const router = useRouter();

    const goToRef = ref();

    const isInited: Ref<boolean> = ref(false);

    const manga = computed(() => store.getters['mangaStore/manga']);
    const chapter = computed(() => store.getters['mangaStore/chapter']);

    const pageIndex = computed(
      () => chapter?.value?.pages?.findIndex(
        ({ number }) => number === parseInt(props.pageNumber, 10),
      ) || 0,
    );

    const nbPages = computed(() => (chapter.value?.pages?.length) || 10);

    const page = computed(() => chapter.value?.pages?.[pageIndex.value]);
    const pageId = computed(() => page.value?.id);

    const previousPage = computed(
      () => (pageIndex.value > 0 ? chapter.value?.pages[pageIndex.value - 1] : null),
    );

    const updateChapterReading = (chapterId: string, isRead: boolean, lastPageReadId: string) => {
      store.dispatch(MangaActionTypes.postChapterReading, {
        chapterId,
        isRead,
        lastPageReadId,
      });
    };

    const goToPrevious = () => {
      if (previousPage.value?.id && chapter.value) {
        router.push({
          name: 'page',
          params: {
            mangaName: props.mangaName,
            chapterNumber: props.chapterNumber,
            pageNumber: previousPage.value.number,
          },
        });
        updateChapterReading(chapter.value.id, false, previousPage.value.id);
        goToRef.value.updatePage(previousPage.value.number);
      }
    };

    const nextPage = computed(
      () => (
        pageIndex.value < (chapter.value?.pages?.length || 0) - 1
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
        if (chapter.value) {
          updateChapterReading(
            chapter.value.id,
            nextPage.value.number === chapter.value.pages.length,
            nextPage.value.id,
          );
          goToRef.value.updatePage(nextPage.value.number);
        }
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
      if (chapter.value) {
        updateChapterReading(chapter.value.id, index === chapter.value.pages.length, pageIdToGo);
        goToRef.value.updatePage(index);
      }
    };

    const updatePagination = (index: number) => {
      if (chapter.value) {
        const pageToGo = chapter.value.pages[index - 1];
        updatePage(pageToGo.id, index);
      }
    };

    const reloadImage = () => {
      const pageImg = document.getElementById('page');
      if (pageImg) {
        const src = `/api/pages/${pageId.value}?t=${new Date().getTime()}`;
        pageImg.setAttribute('src', src);
      }
    };

    const keyEventHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    const isLastChapter = computed(
      () => chapter.value?.number === manga.value?.chapters?.length,
    );

    onMounted(async () => {
      await checkPage(
        props.mangaName,
        parseInt(props.chapterNumber, 10),
        parseInt(props.pageNumber, 10),
      );
      isInited.value = true;

      document.addEventListener('keyup', keyEventHandler);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keyup', keyEventHandler);
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
      isLastChapter,
    };
  },
});
</script>

<style scoped>
.image {
  max-height: 1044px;
}
</style>
