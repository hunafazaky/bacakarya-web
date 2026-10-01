<template>
  <v-row justify="center">
    <v-col cols="12" md="9">
      <v-card>
        <v-card-title>Write a New Work</v-card-title>

        <v-card-text>
          <v-text-field v-model="form.title" label="Title" required />

          <v-select
            v-model="form.category"
            chips
            class="mb-4"
            hint="Choose the category that fits best"
            :items="CATEGORY_ITEMS"
            label="Category"
            multiple
            persistent-hint
          />

          <v-file-input
            v-model="coverFile"
            accept="image/*"
            label="Cover (image, max 2 MB)"
            :rules="[coverRule]"
            show-size
          />

          <v-img
            v-if="coverPreview"
            class="mb-4 rounded"
            cover
            height="200"
            :src="coverPreview"
          />

          <v-file-input
            v-model="attachmentFile"
            class="mb-2"
            label="Attachment (optional, max 10 MB)"
            :rules="[attachmentRule]"
            show-size
          />

          <v-text-field
            v-if="attachmentFile"
            v-model="attachmentTitle"
            class="mb-4"
            label="Attachment Title"
            :placeholder="attachmentFile.name"
          />

          <p class="text-body-2 mb-2">Content</p>
          <TiptapEditor v-model="form.text" />

          <v-alert v-if="error" class="mt-4" density="compact" type="error">
            {{ error }}
          </v-alert>

          <v-btn
            class="mt-4"
            color="primary"
            :disabled="!canSubmit"
            :loading="submitting"
            @click="submit"
          >
            Publish
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const worksStore = useWorksStore()

const form = reactive({
  title: '',
  text: '',
  category: [] as string[],
})
const coverFile = ref<File | null>(null)
const attachmentFile = ref<File | null>(null)
const attachmentTitle = ref('')
const submitting = ref(false)
const error = ref('')

const coverPreview = computed(() =>
  coverFile.value ? URL.createObjectURL(coverFile.value) : null
)
onBeforeUnmount(() => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
})

function coverRule(file: File | File[] | null | undefined) {
  const f = Array.isArray(file) ? file[0] : file
  if (f && f.size > COVER_MAX_BYTES) return 'Cover must be 2 MB or smaller'
  return true
}
function attachmentRule(file: File | File[] | null | undefined) {
  const f = Array.isArray(file) ? file[0] : file
  if (f && f.size > ATTACHMENT_MAX_BYTES)
    return 'Attachment must be 10 MB or smaller'
  return true
}

const canSubmit = computed(
  () =>
    !!form.title &&
    !!form.text &&
    !!coverFile.value &&
    coverFile.value.size <= COVER_MAX_BYTES &&
    (!attachmentFile.value || attachmentFile.value.size <= ATTACHMENT_MAX_BYTES)
)

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    const formData = buildWorkFormData({
      title: form.title,
      text: form.text,
      category: form.category,
      coverFile: coverFile.value,
      attachmentFile: attachmentFile.value,
      attachmentTitle: attachmentTitle.value,
    })
    const work = await worksStore.create(formData)
    await navigateTo(`/work/${work.id}/read`)
  } catch (error_: any) {
    error.value =
      error_?.statusMessage || error_?.message || 'Failed to publish the work'
  } finally {
    submitting.value = false
  }
}
</script>
