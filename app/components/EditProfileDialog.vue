<template>
  <v-dialog v-model="open" max-width="460" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        prepend-icon="mdi-account-edit"
        size="small"
        v-bind="activatorProps"
        variant="tonal"
      >
        Edit profile
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Edit profile</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submit">
          <div class="d-flex justify-center mb-4">
            <v-avatar size="96">
              <AppImage size="200x200" :src="previewSrc" text="Photo" />
            </v-avatar>
          </div>

          <v-text-field
            v-model="penName"
            autofocus
            counter="100"
            :error-messages="nameTouched ? nameError : ''"
            label="Pen name"
            @blur="nameTouched = true"
            @update:model-value="nameTouched = true"
          />

          <v-text-field
            v-model="photoUrl"
            autocomplete="off"
            :error-messages="photoStatus === 'error' ? photoProblem : ''"
            :hint="photoHint"
            inputmode="url"
            label="Photo link"
            :loading="photoStatus === 'checking'"
            persistent-hint
            placeholder="https://example.com/me.jpg"
            type="url"
          />

          <v-alert
            v-if="error"
            class="mt-4"
            density="compact"
            type="error"
            variant="tonal"
          >
            {{ error }}
          </v-alert>

          <!-- Lets Enter submit: with two text fields the browser won't. -->
          <button class="d-none" type="submit" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancel</v-btn>

        <v-btn
          color="primary"
          :disabled="!canSave"
          :loading="saving"
          variant="flat"
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ saved: [] }>()

const auth = useAuthStore()
const notify = useNotifyStore()

const NAME_MAX = 100

const open = ref(false)
const saving = ref(false)
const error = ref('')
const penName = ref('')
const photoUrl = ref('')
const nameTouched = ref(false)

const originalName = computed(() => auth.user?.pen_name ?? '')
const originalPhoto = computed(() => auth.user?.photo ?? '')

const nameError = computed(() => {
  const name = penName.value.trim()
  if (!name) return 'Pen name is required'
  if (name.length > NAME_MAX) {
    return `Pen name must be ${NAME_MAX} characters or fewer`
  }
  return ''
})

// --- photo link check -----------------------------------------------------
// The photo is stored as a link, so before saving we make sure the link
// really loads as an image - a typo would otherwise leave a broken avatar on
// every page the user appears on.
type PhotoStatus = 'idle' | 'checking' | 'ok' | 'error'
const photoStatus = ref<PhotoStatus>('idle')
const photoProblem = ref('')
let checkTimer: ReturnType<typeof setTimeout> | undefined
let checkId = 0

function stopChecking() {
  clearTimeout(checkTimer)
  checkId += 1
}

watch(photoUrl, (value) => {
  stopChecking()
  const url = value.trim()
  // Empty, or the link we already have: nothing to check.
  if (!url || url === originalPhoto.value) {
    photoStatus.value = 'idle'
    return
  }
  if (!isHttpUrl(url)) {
    photoStatus.value = 'error'
    photoProblem.value = 'Enter a link that starts with http:// or https://'
    return
  }
  photoStatus.value = 'checking'
  const id = checkId
  // Debounced so we don't try to load an image on every keystroke.
  checkTimer = setTimeout(() => {
    const probe = new Image()
    probe.addEventListener('load', () => {
      if (id === checkId) photoStatus.value = 'ok'
    })
    probe.addEventListener('error', () => {
      if (id !== checkId) return
      photoStatus.value = 'error'
      photoProblem.value =
        "Couldn't load an image from that link. Make sure it points directly to an image."
    })
    probe.src = url
  }, 400)
})

const photoHint = computed(() => {
  if (photoStatus.value === 'checking') return 'Checking the link…'
  if (photoStatus.value === 'ok') return 'Looks good - this is your new photo.'
  return originalPhoto.value
    ? 'Paste a link to an image. Clearing this keeps your current photo.'
    : 'Paste a link to an image. Photos are links because the server does not store uploads.'
})

const previewSrc = computed(() =>
  photoStatus.value === 'ok' ? photoUrl.value.trim() : originalPhoto.value
)

// --- saving ---------------------------------------------------------------
const nameChanged = computed(() => penName.value.trim() !== originalName.value)
const photoChanged = computed(() => {
  const url = photoUrl.value.trim()
  return !!url && url !== originalPhoto.value
})

const canSave = computed(
  () =>
    !saving.value &&
    !nameError.value &&
    (nameChanged.value || photoChanged.value) &&
    (!photoChanged.value || photoStatus.value === 'ok')
)

// Fresh values every time the dialog opens, so cancelled edits don't linger.
watch(open, (isOpen) => {
  if (!isOpen) {
    stopChecking()
    return
  }
  penName.value = originalName.value
  photoUrl.value = originalPhoto.value
  nameTouched.value = false
  error.value = ''
  photoStatus.value = 'idle'
})

function close() {
  open.value = false
}

async function submit() {
  if (!canSave.value) {
    return
  }
  saving.value = true
  error.value = ''
  // Only send what actually changed.
  const changes: { pen_name?: string; photo?: string } = {}
  if (nameChanged.value) changes.pen_name = penName.value.trim()
  if (photoChanged.value) changes.photo = photoUrl.value.trim()
  try {
    await auth.updateProfile(changes)
    emit('saved')
    notify.success('Profile updated.')
    open.value = false
  } catch (error_: any) {
    // An expired session is handled globally (logout + redirect + message).
    if (error_?.statusCode === 401) {
      return
    }
    error.value =
      error_?.statusCode === 400 && error_?.statusMessage
        ? error_.statusMessage
        : "Couldn't save your changes. Please try again."
  } finally {
    saving.value = false
  }
}
</script>
