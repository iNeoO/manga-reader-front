<template>
  <div class="table mx-auto">
    <div class="flex justify-between mb-2">
      <div>
        <div
          v-if="!isLastChapter"
          class="text-gray-700 dark:text-gray-300
            underline
            cursor-pointer
            hover:text-indigo-500
            dark:hover:text-indigo-500"
          @click="goToNextChapter">
          <span>Go To next chapter</span>
        </div>
        <span class="text-gray-700 dark:text-gray-300">
          Nb Pages: {{ nbPages }}
        </span>
      </div>
      <button
        @click="reloadImage"
        v-if="isLoading"
        class="inline-block text-gray-700 dark:text-gray-300
          hover:text-indigo-500
          dark:hover:text-indigo-500"
        :class="isLoading ? 'animate:spin' : ''" >
        <reload-icon />
      </button>
    </div>
    <div class="relative inline-block">
      <img
        v-if="pageId"
        v-loading-image="isLoading"
        id="page"
        class="image"
        :src="`/api/pages/${pageId}`"/>
      <button
        class="absolute inset-y-0 w-1/4 focus:outline-none"
        :disabled="!previousPage || isLoading"
        @click="goToPrevious" />
      <button
        class="absolute inset-y-0 w-1/4 right-0 focus:outline-none"
        :disabled="!nextPage || isLoading"
        @click="goToNext" />
    </div>
    <div class="flex justify-between mt-4">
      <div class="flex">
        <pagination
          :count="nbPages"
          :page="pageIndex + 1"
          :disabled="isLoading"
          @page-change="updatePagination" />
        <button
          v-if="isLoading"
          class="default-btn ml-4"
          @click="resetStates">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <!-- eslint-disable-next-line max-len -->
            <path d="M7.03 1.88c.252-1.01 1.688-1.01 1.94 0l2.905 11.62H14a.5.5 0 0 1 0 1H2a.5.5 0 0 1 0-1h2.125L7.03 1.88z"/>
          </svg>
        </button>
      </div>
      <go-to
        v-if="isInited"
        ref="goToRef"
        :count="nbPages"
        :page="pageIndex + 1"
        :disabled="isLoading"
        @page-change="updatePagination" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
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

    const isInited = ref(false);
    const isLoading = ref(false);

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
      isLoading.value = true;
      const main = document.querySelector('main');
      if (main) {
        main.scrollTo({
          left: 999,
          top: 0,
          behavior: 'auto',
        });
      }
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

    const goToNextChapter = async () => {
      await router.push({
        name: 'page',
        params: {
          mangaName: props.mangaName,
          chapterNumber: parseInt(props.chapterNumber, 10) + 1,
          pageNumber: 1,
        },
      });
      isInited.value = false;
      await checkPage(
        props.mangaName,
        parseInt(props.chapterNumber, 10),
        parseInt(props.pageNumber, 10),
      );
      isInited.value = true;
    };

    const isLastChapter = computed(
      () => chapter.value?.number === manga.value?.chapters?.length,
    );

    const resetStates = () => {
      isLoading.value = false;
    };

    const successHandler = () => {
      isLoading.value = false;
    };

    const errorHandler = () => {
      isLoading.value = false;
    };

    onMounted(async () => {
      await checkPage(
        props.mangaName,
        parseInt(props.chapterNumber, 10),
        parseInt(props.pageNumber, 10),
      );
      isInited.value = true;

      document.addEventListener('keyup', keyEventHandler);
      const pageElement = document.getElementById('page');
      if (pageElement) {
        pageElement.addEventListener('load', successHandler);
        pageElement.addEventListener('error', errorHandler);
      }
    });

    onBeforeUnmount(() => {
      document.removeEventListener('keyup', keyEventHandler);
      const pageElement = document.getElementById('page');
      if (pageElement) {
        pageElement.removeEventListener('load', successHandler);
        pageElement.removeEventListener('error', errorHandler);
      }
    });

    return {
      isLoading,
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
      goToNextChapter,
      reloadImage,
      resetStates,
      isLastChapter,
    };
  },
});
</script>

<style scoped>
.image {
  height: 603px;
  max-width: fit-content;
}
/* lg */
@media (min-width:768px) {
  .image {
    height: 760px;
    max-width: 100%;
  }
}
/* lg */
@media (min-height:1280px) {
  .image {
    height: 1300px;
    max-width: 100%;
  }
}
</style>
