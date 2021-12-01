<template>
  <div>
    <div class="inline-block mr-4 my-auto text-gray-700 dark:text-gray-300">Go to</div>
    <input
      type="text"
      class="default-input input-max-width inline-block my-auto py-1.5 px-2 text-center text-xs"
      v-model.number="input"
      maxlength="3"
      @keyup.enter="updatePagination"
      @blur="updatePagination" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
} from 'vue';

export default defineComponent({
  props: {
    count: {
      required: true,
      type: Number,
    },
    page: {
      required: true,
      type: Number,
    },
  },
  emits: ['page-change'],
  setup(props, context) {
    const input:Ref<number> = ref(props.page);

    const updatePage = (page: number) => {
      input.value = page;
    };

    const updatePagination = () => {
      if (Math.floor(input.value) === input.value
        && input.value >= 1
        && input.value <= props.count) {
        context.emit('page-change', input.value);
      } else {
        input.value = props.page;
      }
    };

    return {
      input,
      updatePage,
      updatePagination,
    };
  },
});
</script>

<style scoped>
.input-max-width {
  max-width: 4rem;
}
</style>
