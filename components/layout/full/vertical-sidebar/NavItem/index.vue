<!-- eslint-disable vue/no-template-shadow -->
<template>
  <v-list
    v-if="item.children"
    v-model:opened="open"
    :value="true"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <template #prepend>
      <LayoutFullVerticalSidebarIcon :item="item.icon" :level="level" />
    </template>
    <v-list-group>
      <template #activator="{ props }">
        <v-list-item
          v-bind="props"
          :value="true"
          rounded
          class="mb-1"
          :target="item.type === 'external' ? '_blank' : ''"
        >
          <template #prepend>
            <LayoutFullVerticalSidebarIcon :item="item.icon" :level="level" />
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>

      <v-list-group :value="true" :group="item.icon" rounded>
        <template v-for="(s, i) in item.children" :key="i">
          <v-list-item v-if="s.showmenu" color="primary" :to="s.to" rounded>
            <v-list-item-title>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-point iconClass inline"
                width="14px"
                height="14px"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>

              <span class="pa-3">{{ s.title }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            v-else
            class="hideIcon"
            color="primary"
            :to="s.to"
            rounded
          >
          </v-list-item>
        </template>
      </v-list-group>
    </v-list-group>
  </v-list>

  <v-list-item
    v-else
    :to="item.to"
    rounded
    class="mb-1"
    color="primary"
    :target="item.type === 'external' ? '_blank' : ''"
  >
    <template #prepend>
      <LayoutFullVerticalSidebarIcon :item="item.icon" :level="level" />
    </template>
    <v-list-item-title>{{ item.title }}</v-list-item-title>

    <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1">
      {{ item.subCaption }}
    </v-list-item-subtitle>

    <template v-if="item.chip" #append>
      <v-chip
        :color="item.chipColor"
        class="sidebarchip"
        :size="'small'"
        :variant="item.chipVariant"
        :prepend-icon="item.chipIcon"
      >
        {{ item.chip }}
      </v-chip>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});
</script>

<script lang="ts">
const open = ref();
</script>

<style scoped>
a.hideIcon.v-list-item {
  display: none;
}
.v-list-item.v-list-item--prepend.v-theme--PurpleTheme.v-list-item--density-default.v-list-item--one-line.v-list-item--rounded.v-list-item--variant-text.hideIcon {
  display: none;
}
</style>
