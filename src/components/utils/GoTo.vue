<template>
  <span>Go to</span>
  <input
    type="text"
    class="default-input"
    v-model.number="input"
    @keyup.enter="updatePagination"
    @blur="updatePagination" />
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
