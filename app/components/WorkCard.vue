<template>
  <v-card
    class="work-card"
    :disabled="!work.id"
    elevation="1"
    height="100%"
    :to="work.id ? `/work/${work.id}/read` : undefined"
  >
    <div class="cover-wrap">
      <AppImage
        cover
        height="160"
        size="400x600"
        :src="work.cover"
        :text="work.title"
      />

      <div v-if="isOwner && work.id" class="owner-actions" @click.stop.prevent>
        <v-btn
          color="surface"
          icon="mdi-pencil"
          size="x-small"
          :to="`/work/${work.id}/edit`"
          variant="flat"
        />

        <v-btn
          class="ml-1"
          color="surface"
          icon="mdi-delete"
          size="x-small"
          variant="flat"
          @click="$emit('delete', work.id)"
        />
      </div>
    </div>

    <v-card-title class="text-body-1 text-truncate">
      {{ work.title }}
    </v-card-title>

    <v-card-subtitle class="text-truncate">
      {{ work.writer.pen_name }}
    </v-card-subtitle>

    <v-card-text v-if="work.category?.length" class="pt-0">
      <v-chip color="primary" size="x-small" variant="tonal">
        #{{ categoryLabel(work.category[0]) }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PopulatedWork } from '~~/shared/types'

const props = defineProps<{
  work: PopulatedWork
}>()
defineEmits<{ delete: [id: string] }>()

const auth = useAuthStore()
const isOwner = computed(() => auth.user?.id === props.work.writer.id)
</script>

<style scoped>
.work-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.work-card:hover {
  transform: translateY(-2px);
}
.cover-wrap {
  position: relative;
}
.owner-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
}
</style>
