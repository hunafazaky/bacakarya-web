<template>
  <v-btn
    :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggle"
  />
</template>

<script setup lang="ts">
const { isDark, toggle } = useAppTheme()
</script>
