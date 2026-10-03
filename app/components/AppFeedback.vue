<template>
  <!-- Global feedback shared by every layout: messages + the startup page. -->
  <v-snackbar
    v-model="notify.show"
    :color="notify.color"
    location="top"
    multi-line
    :timeout="5000"
  >
    {{ notify.message }}

    <template #actions>
      <v-btn variant="text" @click="notify.show = false">Close</v-btn>
    </template>
  </v-snackbar>

  <ServerWakingOverlay />
</template>

<script setup lang="ts">
const notify = useNotifyStore()
</script>
