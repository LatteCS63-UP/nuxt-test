<template>
  <v-locale-provider>
    <v-app>
      <LayoutFullMain />
      <v-main>
        <v-container fluid class="page-wrapper">
          <div class="maxWidth">
            <NuxtPage />
          </div>
          <div style="height: 50px"></div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
<script lang="ts">
const title = "Admin - Global Stock Portal";
useHead({
  meta: [{ content: title }],
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} - Admin Page`
      : "Admin - Global Stock Portal";
  },
});

export default defineComponent({});
</script>
