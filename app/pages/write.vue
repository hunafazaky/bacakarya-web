<template>
  <v-row justify="center">
    <v-col cols="12" md="9">
      <v-card>
        <v-card-title>Tulis Karya Baru</v-card-title>

        <v-card-text>
          <v-text-field v-model="form.title" label="Judul" required />

          <v-select
            v-model="form.category"
            chips
            class="mb-4"
            hint="Pilih kategori yang paling sesuai"
            :items="CATEGORIES as readonly string[]"
            label="Kategori"
            multiple
            persistent-hint
          />

          <v-file-input
            v-model="coverFile"
            accept="image/*"
            label="Cover (gambar, maks. 2MB)"
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
            label="Lampiran (opsional, maks. 10MB)"
            :rules="[attachmentRule]"
            show-size
          />

          <v-text-field
            v-if="attachmentFile"
            v-model="attachmentTitle"
            class="mb-4"
            label="Judul Lampiran"
            :placeholder="attachmentFile.name"
          />

          <p class="text-body-2 mb-2">Isi Tulisan</p>
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
            Terbitkan
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
  if (f && f.size > COVER_MAX_BYTES) return 'Ukuran cover maksimal 2MB'
  return true
}
function attachmentRule(file: File | File[] | null | undefined) {
  const f = Array.isArray(file) ? file[0] : file
  if (f && f.size > ATTACHMENT_MAX_BYTES) return 'Ukuran lampiran maksimal 10MB'
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
      error_?.statusMessage ||
      error_?.message ||
      'Gagal menerbitkan karya tulis'
  } finally {
    submitting.value = false
  }
}
</script>
