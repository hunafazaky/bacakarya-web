<template>
  <v-app>
    <v-app-bar v-if="auth.isLoggedIn" flat>
      <v-app-bar-title>Bacakarya</v-app-bar-title>
      <v-spacer />
      <v-btn to="/home" variant="text">Beranda</v-btn>
      <v-btn to="/explore" variant="text">Eksplorasi</v-btn>
      <v-btn to="/write" variant="text">Tulis</v-btn>
      <v-btn variant="text" @click="auth.logout(); navigateTo('/')">Keluar</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  const auth = useAuthStore()
</script>
