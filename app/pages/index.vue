<template>
  <v-container class="fill-height" fluid>
    <ThemeToggle class="theme-toggle-floating" />

    <v-row align="center" class="fill-height" justify="center">
      <v-col
        class="d-none d-md-flex flex-column justify-center pr-md-10"
        cols="12"
        md="5"
      >
        <h1 class="brand-hero mb-4">Bacakarya</h1>

        <p class="text-h6 font-weight-regular text-medium-emphasis">
          Tempat menulis, membaca, dan menemukan karya tulis baru.
        </p>
      </v-col>

      <v-col cols="12" md="4" sm="8">
        <h1 class="brand-hero mb-6 d-md-none text-center">Bacakarya</h1>

        <v-card>
          <v-card-title>{{
            mode === 'login' ? 'Masuk' : 'Daftar'
          }}</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field v-model="form.username" label="Username" required />

              <v-text-field
                v-if="mode === 'register'"
                v-model="form.pen_name"
                label="Nama Pena"
                required
              />

              <v-text-field
                v-model="form.password"
                label="Password"
                required
                type="password"
              />

              <v-alert v-if="error" class="mb-4" density="compact" type="error">
                {{ error }}
              </v-alert>

              <v-btn block color="primary" :loading="loading" type="submit">
                {{ mode === 'login' ? 'Masuk' : 'Daftar' }}
              </v-btn>
            </v-form>

            <v-btn block class="mt-2" variant="text" @click="toggleMode">
              {{
                mode === 'login'
                  ? 'Belum punya akun? Daftar'
                  : 'Sudah punya akun? Masuk'
              }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const auth = useAuthStore()
if (auth.isLoggedIn) {
  await navigateTo('/home')
}

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const error = ref('')
const form = reactive({ username: '', pen_name: '', password: '' })

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}

async function submit() {
  loading.value = true
  error.value = ''
  try {
    if (mode.value === 'register') {
      await auth.register({
        username: form.username,
        pen_name: form.pen_name,
        password: form.password,
      })
    }
    await auth.login({ username: form.username, password: form.password })
    await navigateTo('/home')
  } catch (error_: any) {
    error.value =
      error_?.statusMessage || error_?.message || 'Terjadi kesalahan'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.brand-hero {
  font-family: 'Lora', serif;
  font-weight: 600;
  font-size: 3rem;
}
.theme-toggle-floating {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style>
