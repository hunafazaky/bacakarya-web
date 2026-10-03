<template>
  <v-row v-if="!isOwner" justify="center">
    <v-col class="text-center py-10" cols="12" md="6">
      <p class="text-body-1">You don't have permission to edit this work.</p>
      <v-btn class="mt-4" :to="`/work/${workId}/read`">Back</v-btn>
    </v-col>
  </v-row>

  <v-row v-else justify="center">
    <v-col cols="12" md="9">
      <v-card>
        <v-card-title>Edit Work</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="form.title"
            label="Title"
            required
            :rules="[titleRule]"
            validate-on="blur"
          />

          <v-select
            v-model="form.category"
            chips
            class="mb-4"
            :items="CATEGORY_ITEMS"
            label="Category"
            multiple
          />

          <v-file-input
            v-model="coverFile"
            accept="image/*"
            label="Replace Cover (optional, max 2 MB)"
            :rules="[coverRule]"
            show-size
          />

          <AppImage
            class="mb-4 rounded"
            cover
            height="200"
            size="400x600"
            :src="coverPreview || existingWork.cover"
            :text="existingWork.title"
          />

          <v-file-input
            v-model="attachmentFile"
            class="mb-2"
            label="Replace Attachment (optional, max 10 MB)"
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

          <div class="d-flex align-center flex-wrap ga-3 mt-4">
            <v-btn
              color="primary"
              :disabled="!canSubmit"
              :loading="submitting"
              @click="submit"
            >
              Save
            </v-btn>

            <span
              v-if="missing.length > 0"
              class="text-caption text-medium-emphasis"
            >
              To save, add {{ joinWithAnd(missing) }}.
            </span>

            <v-spacer />

            <v-btn
              color="error"
              :loading="deleting"
              variant="tonal"
              @click="confirmOpen = true"
            >
              Delete
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <ConfirmDialog
        v-model="confirmOpen"
        confirm-color="error"
        confirm-text="Delete"
        :loading="deleting"
        :text="`“${existingWork.title}” will be permanently deleted. This can't be undone.`"
        title="Delete this work?"
        @confirm="confirmDelete"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Edit work' })

const route = useRoute()
const workId = route.params.id as string
const auth = useAuthStore()
const worksStore = useWorksStore()

const existingWork = await worksStore.fetchById(workId)
const isOwner = computed(() => auth.user?.id === existingWork.writer.id)

const form = reactive({
  title: existingWork.title,
  text: existingWork.text,
  category: [...(existingWork.category || [])],
})
const coverFile = ref<File | null>(null)
const attachmentFile = ref<File | null>(null)
const attachmentTitle = ref('')
const submitting = ref(false)
const deleting = ref(false)
const confirmOpen = ref(false)
const error = ref('')

const coverPreview = useObjectUrl(() => coverFile.value)

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

const missing = computed(() => {
  const items: string[] = []
  if (!form.title.trim()) items.push('a title')
  if (isRichTextEmpty(form.text)) items.push('some content')
  return items
})

const canSubmit = computed(
  () =>
    !!form.title.trim() &&
    !isRichTextEmpty(form.text) &&
    (!coverFile.value || coverFile.value.size <= COVER_MAX_BYTES) &&
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
    await worksStore.update(workId, formData)
    await navigateTo(`/work/${workId}/read`)
  } catch (error_: any) {
    error.value =
      error_?.statusMessage || error_?.message || 'Failed to save changes'
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  deleting.value = true
  try {
    await worksStore.remove(workId)
    await navigateTo('/home')
  } catch (error_: any) {
    error.value =
      error_?.statusMessage || error_?.message || 'Failed to delete the work'
  } finally {
    deleting.value = false
    confirmOpen.value = false
  }
}
</script>
