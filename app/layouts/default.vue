<template>
  <v-app>
    <v-app-bar v-if="auth.isLoggedIn" border density="comfortable" flat>
      <v-app-bar-title class="brand">Bacakarya</v-app-bar-title>
      <v-spacer />

      <!-- Desktop nav: full row of labeled buttons -->
      <template v-if="!mobile">
        <v-btn prepend-icon="mdi-home" to="/home" variant="text">Home</v-btn>

        <v-btn prepend-icon="mdi-compass" to="/explore" variant="text"
          >Explore</v-btn
        >

        <v-btn
          prepend-icon="mdi-bookmark-multiple"
          to="/bookshelf"
          variant="text"
        >
          Bookshelf
        </v-btn>

        <v-btn
          class="mx-2"
          color="primary"
          prepend-icon="mdi-pencil-plus"
          to="/write"
          variant="tonal"
        >
          Write
        </v-btn>
      </template>

      <ThemeToggle />

      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-avatar v-bind="menuProps" class="cursor-pointer" size="36">
            <AppImage size="100x100" :src="auth.user?.photo" text="Photo" />
          </v-avatar>
        </template>

        <v-list density="compact">
          <v-list-item
            prepend-icon="mdi-account"
            :to="`/user/${auth.user?.username}`"
          >
            My Profile
          </v-list-item>

          <v-list-item prepend-icon="mdi-logout" @click="onLogout">
            Log out
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="py-6" :class="{ 'pb-16': mobile && auth.isLoggedIn }">
        <slot />
      </v-container>
    </v-main>

    <!-- Mobile nav: bottom bar + FAB for the primary "create" action -->
    <template v-if="auth.isLoggedIn && mobile">
      <v-bottom-navigation density="comfortable" grow>
        <v-btn to="/home" value="home">
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>

        <v-btn to="/explore" value="explore">
          <v-icon>mdi-compass</v-icon>
          Explore
        </v-btn>

        <v-btn to="/bookshelf" value="bookshelf">
          <v-icon>mdi-bookmark-multiple</v-icon>
          Bookshelf
        </v-btn>
      </v-bottom-navigation>

      <v-btn
        class="write-fab"
        color="primary"
        icon="mdi-pencil-plus"
        size="large"
        to="/write"
      />
    </template>
  </v-app>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const { mobile } = useDisplay()

function onLogout() {
  auth.logout()
  navigateTo('/')
}
</script>

<style scoped>
.brand {
  font-family: 'Lora', serif;
  font-weight: 600;
}
.write-fab {
  position: fixed;
  right: 16px;
  bottom: 72px;
}
</style>
