<template>
  <NuxtLoadingIndicator color="rgb(var(--v-theme-primary))" :height="3" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useAppTheme().applyStored()

// Browser tab title: "Explore | BacaKarya"; pages set their own part with
// useHead({ title }).
useHead({
  titleTemplate: (title) => (title ? `${title} | BacaKarya` : 'BacaKarya'),
})
</script>
