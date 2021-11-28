<template>
  <div class="flex w-full mx-auto
    overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
    :class="colorDisplayed.icon">
    <div class="flex items-center justify-center w-12"
      :class="colorDisplayed.icon">
        <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <!-- eslint-disable-next-line max-len -->
          <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"/>
        </svg>
    </div>

    <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
            <span class="font-semibold text-yellow-400 dark:text-yellow-300"
              :class="colorDisplayed.text">{{ title }}</span>
            <p class="text-sm text-gray-600 dark:text-gray-200">{{ subtitle }}</p>
        </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value),
    },
  },
  setup(props) {
    type Color = {
      type: string,
      icon: string,
      text: string,
    };

    const colors = [
      {
        type: 'info',
        icon: 'bg-blue-400',
        text: 'text-blue-500 dark:text-blue-400',
      },
      {
        type: 'success',
        icon: 'bg-green-400',
        text: 'text-green-500 dark:text-green-400',
      },
      {
        type: 'warning',
        icon: 'bg-yellow-400',
        text: 'text-yellow-500 dark:text-yellow-400',
      },
      {
        type: 'error',
        icon: 'bg-red-400',
        text: 'text-red-500 dark:text-red-400',
        shadow: 'rgba(251, 191, 36, var(--tw-bg-opacity))',
      },
    ];
    const colorDisplayed = computed(
      (): Color => colors.find((color: Color) => color.type === props.type) || colors[0],
    );

    return {
      colorDisplayed,
    };
  },
});
</script>
