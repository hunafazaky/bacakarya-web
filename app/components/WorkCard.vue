<template>
  <v-card height="100%" :to="`/work/${work.id}/read`">
    <v-img cover height="160" :src="work.cover" />

    <v-card-title class="text-body-1 text-truncate">
      {{ work.title }}
    </v-card-title>

    <v-card-subtitle class="text-truncate">
      {{ work.writer.pen_name }}
    </v-card-subtitle>

    <v-card-text v-if="work.category?.length">
      <v-chip size="x-small" variant="tonal">
        #{{ work.category[0] }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { PopulatedWork } from '~~/shared/types'

  defineProps<{
    work: PopulatedWork
  }>()
</script>
