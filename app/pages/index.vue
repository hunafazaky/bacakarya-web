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
          A place to write, read, and discover new works.
        </p>
      </v-col>

      <v-col cols="12" md="4" sm="8">
        <h1 class="brand-hero mb-6 d-md-none text-center">Bacakarya</h1>

        <v-card>
          <v-card-title>{{
            mode === 'login' ? 'Log in' : 'Sign up'
          }}</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field v-model="form.username" label="Username" required />

              <v-text-field
                v-if="mode === 'register'"
                v-model="form.pen_name"
                label="Pen Name"
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
                {{ mode === 'login' ? 'Log in' : 'Sign up' }}
              </v-btn>
            </v-form>

            <v-btn block class="mt-2" variant="text" @click="toggleMode">
              {{
                mode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Log in'
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
  // Registration and login are two requests. If registering worked but the
  // login after it failed, retrying must only log in - registering again
  // would fail with "already exists" for an account that was just created.
  let registered = false
  try {
    if (mode.value === 'register') {
      await auth.register({
        username: form.username,
        pen_name: form.pen_name,
        password: form.password,
      })
      registered = true
    }
    await auth.login({ username: form.username, password: form.password })
    await navigateTo('/home')
  } catch (error_: any) {
    if (registered) {
      mode.value = 'login'
      error.value =
        'Your account was created, but logging in failed. Please log in again.'
    } else {
      error.value =
        error_?.statusMessage || error_?.message || 'Something went wrong'
    }
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
