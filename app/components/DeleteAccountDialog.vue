<template>
  <v-dialog v-model="open" max-width="420" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn
        color="error"
        prepend-icon="mdi-account-remove"
        v-bind="activatorProps"
        variant="tonal"
      >
        Delete Account
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Delete Account?</v-card-title>

      <v-card-text>
        <p class="mb-4">
          This action cannot be undone. All works you have written will be
          deleted too. Enter your password to confirm.
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
        <v-btn variant="text" @click="close">Cancel</v-btn>

        <v-btn
          color="error"
          :disabled="!password"
          :loading="loading"
          @click="submit"
        >
          Delete Account
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
        ? 'Incorrect password.'
        : error_?.statusMessage ||
          error_?.message ||
          'Failed to delete account.'
  } finally {
    loading.value = false
  }
}
</script>
