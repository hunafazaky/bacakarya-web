<template>
  <v-sheet
    v-if="loading"
    height="100%"
    width="100%"
    class="absolute"
    color="rgba(255, 255, 255, 0.5)"
  >
    <v-progress-circular
      class="absolute"
      :size="70"
      :width="7"
      color="info"
      indeterminate
    ></v-progress-circular>
  </v-sheet>
  <!-- <v-progress-circular
    v-if="loading"
    class="loading-style"
    :size="50"
    :width="5"
    color="indigo"
    indeterminate
  ></v-progress-circular> -->
</template>

<script>
export default {
  name: 'LoadingPage',
  props: ['loading'],
  data() {
    return {};
  },
};
</script>

<style scoped>
.absolute {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  z-index: 1;
}
/* .loading-style {
  position: absolute;
  transform: translate(-50%, -50%);
  inset: 50%;
} */
</style>
