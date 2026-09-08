<template>
  <v-card width="100%" style="position: relative">
    <v-progress-circular
      v-if="loading"
      class="loading-style"
      :size="20"
      :width="2"
      color="indigo"
      indeterminate
    ></v-progress-circular>
  </v-card>
</template>

<script>
export default {
  name: 'LoadingComponent',
  props: ['loading'],
  data() {
    return {};
  },
};
</script>

<style scoped>
.loading-style {
  position: absolute;
  transform: translate(-50%);
  inset: 50%;
}
</style>
