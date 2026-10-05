<template>
  <section aria-live="polite" class="waking" role="status">
    <p class="waking-brand">BacaKarya</p>

    <h1 class="waking-title">
      {{ ready ? 'The server is ready' : 'The server is waking up' }}
    </h1>

    <p v-if="ready" class="waking-text">
      The server has started. Reload to continue.
    </p>

    <p v-else-if="longWait" class="waking-text">
      This is taking longer than usual. The server may be having trouble, so you
      can try again.
    </p>

    <p v-else class="waking-text">
      BacaKarya runs on a free hosting plan that pauses when nobody has used it
      for a while. Starting it again usually takes up to a minute.
    </p>

    <template v-if="!ready">
      <div aria-hidden="true" class="waking-track">
        <div class="waking-fill" :style="{ width: `${progress}%` }" />
      </div>

      <p class="waking-meta">{{ meta }} {{ resumeText }}</p>
    </template>

    <v-btn
      v-if="retryable && (ready || longWait)"
      class="mt-6"
      color="primary"
      @click="emit('retry')"
    >
      {{ ready ? 'Reload' : 'Try again' }}
    </v-btn>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** Show a button (after a long wait, or once ready) that emits `retry`. */
    retryable?: boolean
    /** The server answered; waiting is over. */
    ready?: boolean
    resumeText?: string
    /** Seconds already spent waiting before this screen appeared. */
    alreadyWaited?: number
    /** Seconds after which we admit this is taking unusually long. */
    longWaitAfter?: number
  }>(),
  {
    retryable: false,
    ready: false,
    resumeText: 'This page will continue by itself.',
    alreadyWaited: 0,
    longWaitAfter: 90,
  }
)
const emit = defineEmits<{ retry: [] }>()

// A cold start usually takes up to about a minute; the track shows that
// typical wait (it never claims to be finished before the server answers).
const TYPICAL_WAIT_SECONDS = 60

const sinceShown = useElapsedSeconds()
const elapsed = computed(() => sinceShown.value + props.alreadyWaited)
const progress = computed(() =>
  Math.min(95, (elapsed.value / TYPICAL_WAIT_SECONDS) * 100)
)
const longWait = computed(() => elapsed.value >= props.longWaitAfter)
const meta = computed(() =>
  elapsed.value <= TYPICAL_WAIT_SECONDS
    ? `Waiting ${elapsed.value} s of about ${TYPICAL_WAIT_SECONDS} s.`
    : `Waiting ${elapsed.value} s.`
)
</script>

<style scoped>
.waking {
  width: min(100%, 30rem);
}
.waking-brand {
  margin: 0 0 1.5rem;
  font-family: 'Lora', Georgia, serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}
.waking-title {
  margin: 0 0 0.75rem;
  font-family: 'Lora', Georgia, serif;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 600;
  line-height: 1.15;
  text-wrap: balance;
}
.waking-text {
  margin: 0 0 1.75rem;
  line-height: 1.65;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
.waking-track {
  height: 3px;
  overflow: hidden;
  border-radius: 2px;
  background: rgba(var(--v-theme-on-background), 0.12);
}
.waking-fill {
  height: 100%;
  background: rgb(var(--v-theme-primary));
  transition: width 1s linear;
}
.waking-meta {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
@media (prefers-reduced-motion: reduce) {
  .waking-fill {
    transition: none;
  }
}
</style>
