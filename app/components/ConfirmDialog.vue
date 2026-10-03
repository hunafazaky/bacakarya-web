<template>
  <v-dialog v-model="open" max-width="420" :persistent="loading">
    <v-card>
      <v-card-title class="text-wrap">{{ title }}</v-card-title>

      <v-card-text v-if="text">{{ text }}</v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn :disabled="loading" variant="text" @click="open = false">
          Cancel
        </v-btn>

        <v-btn
          :color="confirmColor"
          :loading="loading"
          variant="flat"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    text?: string
    confirmText?: string
    confirmColor?: string
    loading?: boolean
  }>(),
  { text: '', confirmText: 'Confirm', confirmColor: 'primary', loading: false }
)
const emit = defineEmits<{ confirm: [] }>()
const open = defineModel<boolean>({ default: false })
</script>
