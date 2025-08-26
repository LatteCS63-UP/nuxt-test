<template>
  <v-card elevation="10" class="withbg">
    <v-card-item class="pa-0">
      <div class="d-sm-flex align-center justify-space-between">
        <slot name="action"></slot>
      </div>

      <slot />
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      props: { defineProps: { title: String, class: String } },
    };
  },
});
</script>
