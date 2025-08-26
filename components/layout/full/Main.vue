<template>
  <v-navigation-drawer
    v-model="sDrawer"
    left
    elevation="0"
    app
    class="leftSidebar"
  >
    <div class="pa-5 logo-group">
      <LayoutFullLogo />
    </div>
    <div>
      <perfect-scrollbar class="scrollnavbar">
        <!-- <v-list class="pa-3">
          <template v-for="(item, i) in sidebarMenu" :key="i">
            <LayoutFullVerticalSidebarNavItem
              :item="item"
              class="leftPadding"
              :level="0"
            />
          </template>
        </v-list> -->
      </perfect-scrollbar>
    </div>
  </v-navigation-drawer>
  <!------Header-------->
  <v-app-bar elevation="0" height="70">
    <div class="d-flex align-center justify-space-between w-100">
      <div>
        <v-btn
          class="ms-md-3 ms-sm-5 ms-3 text-muted"
          variant="flat"
          size="large"
          @click="sDrawer = !sDrawer"
        >
          <Menu2Icon size="20" />
        </v-btn>
        <!-- <LayoutFullVerticalHeaderNotificationDD /> -->
      </div>
      <div id="username-div">
        <div class="d-flex">
          <!-- <LayoutFullVerticalHeaderUserNameDD /> -->

          <!-- <LayoutFullVerticalHeaderProfileDD /> -->
        </div>
      </div>
    </div>
  </v-app-bar>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// import sidebarItem from "./vertical-sidebar/sidebarItem";

export default defineComponent({
  data() {
    return {
      sDrawer: true,
      // sidebarMenu: sidebarItem,
    };
  },
});
</script>
<style scoped>
#username-div {
  right: 0%;
  position: absolute;
}
</style>
