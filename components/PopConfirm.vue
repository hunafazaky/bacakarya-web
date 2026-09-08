<template>
  <v-dialog :value="showPopConfirm" max-width="400px" persistent>
    <v-card>
      <v-card-title class="overline">{{ message }}</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" text @click="$emit('confirm')">Ya</v-btn>
        <v-btn color="error" text @click="$emit('hidePopConfirm')">Tidak</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PopConfirm',
  props: {
    message: {
      type: String,
      default: 'Apakah anda yakin?',
    },
    showPopConfirm: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
