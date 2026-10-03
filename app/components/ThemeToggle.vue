<template>
  <v-btn
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggle"
  />
</template>

<script setup lang="ts">
const { isDark, toggle } = useAppTheme()
</script>
