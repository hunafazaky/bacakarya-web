<template>
  <v-row v-if="!isOwner" justify="center">
    <v-col class="text-center py-10" cols="12" md="6">
      <p class="text-body-1">
        Kamu tidak punya akses untuk mengedit karya tulis ini.
      </p>
      <v-btn class="mt-4" :to="`/work/${workId}/read`">Kembali</v-btn>
    </v-col>
  </v-row>

  <v-row v-else justify="center">
    <v-col cols="12" md="9">
      <v-card>
        <v-card-title>Edit Karya Tulis</v-card-title>

        <v-card-text>
          <v-text-field v-model="form.title" label="Judul" required />

          <v-select
            v-model="form.category"
            chips
            class="mb-4"
            :items="CATEGORIES as readonly string[]"
            label="Kategori"
            multiple
          />

          <v-file-input
            v-model="coverFile"
            accept="image/*"
            label="Ganti Cover (opsional, maks. 2MB)"
            :rules="[coverRule]"
            show-size
          />

          <v-img
            class="mb-4 rounded"
            cover
            height="200"
            :src="coverPreview || existingWork.cover"
          />

          <v-file-input
            v-model="attachmentFile"
            class="mb-2"
            label="Ganti Lampiran (opsional, maks. 10MB)"
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

          <div class="d-flex mt-4">
            <v-btn
              color="primary"
              :disabled="!canSubmit"
              :loading="submitting"
              @click="submit"
            >
              Simpan
            </v-btn>

            <v-spacer />

            <v-btn
              color="error"
              :loading="deleting"
              variant="tonal"
              @click="confirmDelete"
            >
              Hapus
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

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
      error_?.statusMessage || error_?.message || 'Gagal menyimpan perubahan'
  } finally {
    submitting.value = false
  }
}

async function confirmDelete() {
  if (!window.confirm('Apakah anda ingin menghapus karya tulis ini?')) return
  deleting.value = true
  try {
    await worksStore.remove(workId)
    await navigateTo('/home')
  } catch (error_: any) {
    error.value =
      error_?.statusMessage || error_?.message || 'Gagal menghapus karya tulis'
  } finally {
    deleting.value = false
  }
}
</script>
