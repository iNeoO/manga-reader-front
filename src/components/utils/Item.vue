<template>
  <router-link :to="to">
    <div class="flex flex-col py-2 px-4 bg-white dark:bg-gray-900 rounded
      mb-4 shadow-sm"
      :class="isRead ? 'opacity-50' : ''">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex">
            <img :data-src="imgSrc" :src="loadingImg" alt="cover image" class="mr-8 image" />
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {{ name }}
              </h3>
              <slot name="legend" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ComputedRef,
} from 'vue';

import loadingImg from '@/assets/loading.png';

export default defineComponent({
  name: 'item',
  props: {
    name: {
      type: String,
      required: true,
    },
    to: {
      type: Object as PropType<{ name: string, params: { [key:string]: string } }>,
    },
    imageId: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const imgSrc: ComputedRef<string> = computed(() => `/api/pages/${props.imageId}/minified`);

    return {
      loadingImg,
      imgSrc,
    };
  },
});
</script>

<style scoped>
.image {
  min-height: 75px;
}
</style>
