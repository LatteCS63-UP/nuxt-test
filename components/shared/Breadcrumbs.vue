<template>
  <div class="bg-grey100">
    <div class="px-6 py-lg-0 bg-gray100">
      <div class="d-flex justify-space-between">
        <div class="d-flex py-0 align-center">
          <h5 class="text-h6 pb-1 pt-5 text-darkblue">
            {{ title }}
          </h5>
        </div>
      </div>
    </div>
    <v-breadcrumbs :items="items">
      <template #divider>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script lang="ts">
export type Breadcrumb = {
  title: string;
  disabled: boolean;
  href?: string;
};
export default {
  props: {
    items: {
      type: Array as () => Breadcrumb[],
      required: false,
      default: () => [],
    },
    title: {
      type: String,
      required: false,
      default: "",
    },
  },
};
</script>
