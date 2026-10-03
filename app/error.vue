<template>
  <v-app>
    <v-main>
      <div class="error-shell">
        <!-- Backend asleep / unreachable: explain, then recover by itself. -->
        <ServerWaking v-if="waking" :ready="ready" retryable @retry="reload" />

        <section v-else class="error-card">
          <p class="error-code">Error {{ error.statusCode }}</p>
          <h1 class="error-title">{{ heading }}</h1>
          <p class="error-text">{{ message }}</p>

          <div class="d-flex flex-wrap ga-3 mt-6">
            <v-btn color="primary" @click="goHome">Go to home</v-btn>

            <v-btn v-if="!notFound" variant="text" @click="reload">
              Try again
            </v-btn>
          </div>
        </section>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

// This page replaces app.vue, so the saved theme has to be applied here too.
useAppTheme().applyStored()

const waking = computed(() => isBackendWaking(props.error))
const notFound = computed(() => props.error.statusCode === 404)
const ready = ref(false)

const heading = computed(() =>
  notFound.value ? "We can't find that page" : 'Something went wrong'
)
const message = computed(() =>
  notFound.value
    ? 'It may have been moved or deleted.'
    : 'Please try again. If it keeps happening, come back in a few minutes.'
)

useHead({
  title: () =>
    waking.value
      ? 'Server starting up'
      : notFound.value
        ? 'Page not found'
        : 'Something went wrong',
})

function reload() {
  window.location.reload()
}

async function goHome() {
  // The auth middleware sends logged-out visitors on to the login page.
  await clearError({ redirect: '/home' })
}

if (waking.value) {
  useWakeUpPoll({
    onReady() {
      if (reserveAutoReload()) {
        window.location.reload()
      } else {
        ready.value = true
      }
    },
  })
}
</script>

<style scoped>
.error-shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px 20px;
}
.error-card {
  width: min(100%, 30rem);
}
.error-code {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
.error-title {
  margin: 0 0 0.75rem;
  font-family: 'Lora', Georgia, serif;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 600;
  line-height: 1.15;
  text-wrap: balance;
}
.error-text {
  margin: 0;
  line-height: 1.65;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
