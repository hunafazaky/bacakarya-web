<template>
  <v-app dark>
    <v-main class="login-page">
      <v-container>
        <Nuxt />
      </v-container>
      <p class="caption text-center">
        <a
          class="text-decoration-none text--secondary"
          href="https://pngtree.com/so/people"
          >people png from pngtree.com</a
        >
      </p>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'LoginLayout',
  data() {
    return {};
  },
};
</script>

<style scoped>
@media only screen and (max-width: 960px) {
  .login-page {
    background-image: url(/login-image.png);
    background-size: cover;
  }
}
</style>
