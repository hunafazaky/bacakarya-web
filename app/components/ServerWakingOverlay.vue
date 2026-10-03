<template>
  <Transition name="waking-fade">
    <div v-if="backend.waking" class="waking-overlay">
      <ServerWaking
        :already-waited="SLOW_AFTER_MS / 1000"
        resume-text="Your request will continue by itself."
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
// Full-screen startup page shown when a request has been waiting longer than
// SLOW_AFTER_MS (see plugins/01.api.ts). It disappears on its own as soon as
// the server answers.
const backend = useBackendStore()
</script>

<style scoped>
.waking-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: 24px 20px;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
}
.waking-fade-enter-active,
.waking-fade-leave-active {
  transition: opacity 0.2s ease;
}
.waking-fade-enter-from,
.waking-fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .waking-fade-enter-active,
  .waking-fade-leave-active {
    transition: none;
  }
}
</style>
