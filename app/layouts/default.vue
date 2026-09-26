<template>
  <v-app>
    <v-app-bar v-if="auth.isLoggedIn" border flat>
      <v-app-bar-title class="brand">Bacakarya</v-app-bar-title>
      <v-spacer />
      <v-btn prepend-icon="mdi-home" to="/home" variant="text">Beranda</v-btn>
      <v-btn prepend-icon="mdi-compass" to="/explore" variant="text">Eksplorasi</v-btn>

      <v-btn prepend-icon="mdi-bookmark-multiple" to="/bookshelf" variant="text">
        Rak Buku
      </v-btn>

      <v-btn
        class="mx-2"
        color="primary"
        prepend-icon="mdi-pencil-plus"
        to="/write"
        variant="tonal"
      >
        Tulis
      </v-btn>

      <v-menu>
        <template #activator="{ props: menuProps }">
          <v-avatar v-bind="menuProps" class="cursor-pointer" size="36">
            <v-img :src="auth.user?.photo" />
          </v-avatar>
        </template>

        <v-list density="compact">
          <v-list-item prepend-icon="mdi-account" :to="`/user/${auth.user?.username}`">
            Profil Saya
          </v-list-item>

          <v-list-item prepend-icon="mdi-logout" @click="onLogout">
            Keluar
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const auth = useAuthStore()

  function onLogout () {
    auth.logout()
    navigateTo('/')
  }
</script>

<style scoped>
.brand {
  font-family: 'Lora', serif;
  font-weight: 600;
}
</style>
