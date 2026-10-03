<template>
  <!--
    "disable-shrink" is set explicitly because Vuetify otherwise picks that
    variant by calling window.matchMedia while rendering: the server (no
    window) and a reduced-motion browser then disagree, which logs a
    hydration class mismatch - and in production leaves reduced-motion users
    with the full animation. Fixing the variant makes both sides agree.
  -->
  <v-progress-circular
    color="primary"
    indeterminate="disable-shrink"
    :size="size"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: 32 })
</script>
