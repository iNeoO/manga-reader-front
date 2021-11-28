<template>
  <div class="app">
    <layout>
      <router-view/>
    </layout>
  </div>
</template>

<script >
import { defineComponent } from 'vue';
import Layout from '@/components/layout/Layout.vue';

export default defineComponent({
  name: 'app',
  components: {
    Layout,
  },
});
</script>
