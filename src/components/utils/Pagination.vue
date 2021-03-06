<template>
  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
    <a href="#" class="relative inline-flex items-center px-2 py-2
      rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
      text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
      @click="paginationClick(page - 1)">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <!-- eslint-disable-next-line max-len -->
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </a>
    <a
      v-for="(pagination, index) in pages"
      :key="index"
      @click="paginationClick(pagination)"
      class="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500
        hidden md:inline-flex relative items-center
      px-4 py-2 border text-sm font-medium"
      :class="paginationClass(pagination)">
      {{ pagination }}
    </a>
    <a href="#" class="relative inline-flex items-center px-2 py-2
      rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900
      text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
      @click="paginationClick(page + 1)">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
         <!-- eslint-disable-next-line max-len -->
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </a>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'pagination',
  props: {
    count: {
      required: true,
      type: Number,
    },
    page: {
      required: true,
      type: Number,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  emits: ['page-change'],
  setup(props, context) {
    const pages = computed(() => {
      const array = Array(props.count - 2)
        .fill(0).map((_, i) => i + 2)
        .reduce((acc: Array<number | string>, curr) => {
          if (curr + 1 === props.page
            || curr - 1 === props.page
            || curr === props.page) {
            acc.push(curr);
          } else if (acc[acc.length - 1] !== '...') {
            acc.push('...');
          }
          return acc;
        }, []);
      return [1, ...array, props.count];
    });

    const paginationClass = (nb: number | string) => {
      if (nb === props.page) {
        return {
          'border-indigo-500': true,
          'bg-indigo-50': true,
          'dark:bg-indigo-900': true,
          'text-indigo-600': true,
          'dark:text-indigo-300': true,
          'z-10': true,
          'cursor-default': true,
          'cursor-not-allowed': props.disabled,
        };
      }
      if (nb === '...') {
        return {
          'cursor-default': true,
          'cursor-not-allowed': props.disabled,
        };
      }
      return {
        'cursor-pointer': true,
        'hover:bg-gray-50': true,
        'dark:hover:bg-gray-800': true,
        'cursor-not-allowed': props.disabled,
      };
    };

    const paginationClick = (nb: number | string) => {
      if (props.disabled) {
        return;
      }
      if (typeof nb === 'number'
        && nb > 0
        && nb < props.count + 1
        && nb !== props.page) {
        context.emit('page-change', nb);
      }
    };

    return {
      pages,
      paginationClass,
      paginationClick,
    };
  },
});
</script>
