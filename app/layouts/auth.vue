<template>
  <v-app>
    <v-main>
      <!-- Centers the login card in the viewport (the default layout's
           padded container can't, which is why it used to sit at the top). -->
      <div class="auth-shell">
        <slot />
      </div>
    </v-main>

    <AppFeedback />
  </v-app>
</template>

<style scoped>
.auth-shell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px 16px;
}
</style>
