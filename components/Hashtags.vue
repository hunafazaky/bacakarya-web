<template>
  <v-slide-group
    v-model="hashtagActived"
    active-class="secondary"
    prev-icon="mdi-arrow-left-bold-box"
    next-icon="mdi-arrow-right-bold-box"
    show-arrows
  >
    <v-slide-item
      v-for="hashtag in hashtags"
      :key="hashtag.id"
      v-slot="{ active, toggle }"
      :value="hashtag.name"
    >
      <v-btn
        class="mx-1 my-1 rounded-lg"
        :input-value="active"
        :dark="active"
        outlined
        depressed
        small
        @click="toggle"
        v-text="hashtag.name"
      ></v-btn>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  name: 'Hashtags',
  props: [],
  data: () => ({
    hashtagActived: null,
  }),
  computed: {
    hashtags() {
      return this.$store.state.hashtags.data
    },
  },
  methods: {
    sendHashtag(data) {
      this.$emit('hashtag-actived', data)
    },
  },
  watch: {
    hashtagActived(newValue, oldValue) {
      // Di sini Anda dapat menjalankan metode atau tindakan yang Anda inginkan
      // console.log('Nilai berubah dari', oldValue, 'ke', newValue);
      // console.log();
      this.sendHashtag(newValue)
    },
  },
}
</script>

<!-- v-if="i < 5"
  :key="i"
  :style="`left: ${i * 25}px;`"
  :to="'/user/' + userByID(reader.user_id).account.username" -->
