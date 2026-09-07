<template>
  <v-dialog :value="showPopZoom" :max-width="maxWidth" persistent>
    <v-sheet
      @click="$emit('hidePopZoom')"
      outlined
      width="100%"
      class="zoom-out-pointer"
    >
      <v-img height="100%" cover :src="image"></v-img>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: 'PopZoom',
  props: {
    maxWidth: { type: [String, Number], default: undefined },
    image: { type: String, default: '' },
    showPopZoom: { type: Boolean, default: false },
  },
}
</script>
