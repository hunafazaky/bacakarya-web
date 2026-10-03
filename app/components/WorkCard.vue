<template>
  <!--
    The owner buttons are siblings of the card, not children: the card
    renders as a link (<a>), and links/buttons nested inside another link are
    invalid HTML and can cause hydration warnings.
  -->
  <div class="work-card-wrap">
    <v-card
      class="work-card"
      :disabled="!work.id"
      elevation="1"
      height="100%"
      :to="work.id ? `/work/${work.id}/read` : undefined"
    >
      <AppImage
        cover
        height="160"
        size="400x600"
        :src="work.cover"
        :text="work.title"
      />

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

    <div v-if="isOwner && work.id" class="owner-actions">
      <v-btn
        aria-label="Edit work"
        color="surface"
        icon="mdi-pencil"
        size="x-small"
        :to="`/work/${work.id}/edit`"
        variant="flat"
      />

      <v-btn
        aria-label="Delete work"
        class="ml-1"
        color="surface"
        icon="mdi-delete"
        size="x-small"
        variant="flat"
        @click="onDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PopulatedWork } from '~~/shared/types'

const props = defineProps<{
  work: PopulatedWork
}>()
const emit = defineEmits<{ delete: [id: string] }>()

const auth = useAuthStore()
const isOwner = computed(() => auth.user?.id === props.work.writer.id)

function onDelete() {
  if (!window.confirm('Are you sure you want to delete this work?')) {
    return
  }
  emit('delete', props.work.id)
}
</script>

<style scoped>
.work-card-wrap {
  position: relative;
  height: 100%;
  transition: transform 0.15s ease;
}
.work-card-wrap:hover {
  transform: translateY(-2px);
}
.owner-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
}
</style>
