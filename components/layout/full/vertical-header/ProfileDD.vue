<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <v-menu :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        class="profileBtn custom-hover-primary"
        variant="text"
        v-bind="props"
        icon
      >
        <v-avatar size="35">
          <img
            src="~/assets/images/users/avatar-1.jpg"
            height="35"
            alt="user"
          />
        </v-avatar>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
      <!-- <v-list class="py-0" lines="one" density="compact">
        <v-list-item value="item1" color="primary">
          <template #prepend>
            <UserIcon size="20" />
          </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Profile</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="item2" color="primary">
          <template #prepend>
            <MailIcon size="20" />
          </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Account</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="item3" color="primary">
          <template #prepend>
            <ListCheckIcon size="20" />
          </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Task</v-list-item-title
          >
        </v-list-item>
      </v-list> -->
      <div class="pt-4 pb-4 px-5 text-center">
        <v-btn
          to="/authen/login"
          color="primary"
          variant="outlined"
          block
          @click="doLogout()"
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
<script lang="ts">
import {} from "vue-tabler-icons";

export default defineComponent({
  methods: {
    async doLogout() {
      // await logout();
    },
  },
});
</script>
