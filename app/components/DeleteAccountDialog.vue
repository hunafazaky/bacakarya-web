<template>
  <v-dialog v-model="open" max-width="420" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        color="error"
        prepend-icon="mdi-account-remove"
        v-bind="activatorProps"
        variant="tonal"
      >
        Hapus Akun
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Hapus Akun?</v-card-title>

      <v-card-text>
        <p class="mb-4">
          Tindakan ini tidak dapat dibatalkan. Semua karya tulis yang kamu buat
          akan ikut terhapus. Masukkan password untuk mengonfirmasi.
        </p>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="password"
            autofocus
            :error-messages="error"
            label="Password"
            type="password"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Batal</v-btn>

        <v-btn
          color="error"
          :disabled="!password"
          :loading="loading"
          @click="submit"
        >
          Hapus Akun
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const auth = useAuthStore()

const open = ref(false)
const password = ref('')
const loading = ref(false)
const error = ref('')

function close() {
  open.value = false
  password.value = ''
  error.value = ''
}

async function submit() {
  if (!password.value) {
    return
  }
  loading.value = true
  error.value = ''
  try {
    await auth.deleteAccount(password.value)
    await navigateTo('/')
  } catch (error_: any) {
    error.value =
      error_?.statusCode === 401
        ? 'Password salah.'
        : error_?.statusMessage || error_?.message || 'Gagal menghapus akun.'
  } finally {
    loading.value = false
  }
}
</script>
