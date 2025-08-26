<template>
  <v-list class="py-0 align-end justify-space-end">
    <v-list-item>
      <v-list-item-title class="pl-4 text-body-1 text-blue">
        {{ firstname }} {{ lastname }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import { useSessionStore } from '~/stores/sessionStore';
export default defineComponent({
  data() {
    return {
      firstname: "Watthana",
      lastname: "Peerajing",
    };
  },
});
</script>
<style scoped>
.text-blue {
  color: #539bff;
}
</style>
