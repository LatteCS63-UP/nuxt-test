<template>
  <template v-if="level > 0">
    <component
      :is="item"
      size="5"
      fill="currentColor"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
  <template v-else>
    <component
      :is="item"
      size="20"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
</template>
<script lang="ts">
// import { defineProps } from 'vue';
// const props = defineProps({ item: Object, level: Number });
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
};
</script>
