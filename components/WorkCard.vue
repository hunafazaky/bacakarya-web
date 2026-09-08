<template>
  <v-sheet
    rounded="lg"
    :width="size.numbers * 1 + size.units"
    class="overflow-hidden mb-2"
    :style="{
      'padding-top': size.numbers * (19 / 13) + size.units,
      position: 'relative',
    }"
  >
    <v-card
      rounded="lg"
      style="inset: 0; position: absolute"
      class="card"
      elevation="2"
      height="100%"
      width="100%"
      dark
    >
      <v-img
        height="100%"
        :src="work.cover"
        gradient="to top, rgba(12.9, 12.9, 12.9, 0), rgba(12.9, 12.9, 12.9, 1)"
      >
        <v-card-actions
          v-if="miniVariant === false && work.writer"
          class="d-flex align-center pa-4"
        >
          <nuxt-link
            :to="`/user/${work.writer.username}`"
            class="text-decoration-none white--text text-truncate"
          >
            <v-avatar class="mr-1" color="white" size="28">
              <v-img :src="work.writer.photo"></v-img>
            </v-avatar>
            <span
              class="font-weight-bold text-truncate text-capitalize"
              v-text="work.writer.pen_name"
            ></span>
          </nuxt-link>
        </v-card-actions>
        <v-card-text
          class="title text-capitalize caption"
          v-text="
            work.title.length > wordLimit.title
              ? work.title.slice(0, wordLimit.title) + '...'
              : work.title
          "
        ></v-card-text>
        <v-card-actions>
          <div v-if="miniVariant === true" class="absolute bottom">
            <v-btn icon class="mb-1" color="primary">
              <v-icon> mdi-text-box-check </v-icon>
            </v-btn>
            <v-btn
              icon
              class="mb-1"
              color="success"
              nuxt
              :to="`/work/${work.id}/read`"
            >
              <v-icon> mdi-text-box-search </v-icon>
            </v-btn>
            <template v-if="mutation === true && isOwner">
              <v-btn
                icon
                class="mb-1"
                color="warning"
                nuxt
                :to="`/work/${work.id}/edit`"
              >
                <v-icon> mdi-text-box-edit </v-icon>
              </v-btn>
              <v-btn
                icon
                class="mb-1"
                color="error"
                @click="removeWork(work.id)"
              >
                <v-icon> mdi-text-box-remove </v-icon>
              </v-btn>
            </template>
          </div>
          <div v-else class="mx-2 absolute bottom">
            <v-row>
              <v-col cols="12" class="ma-0 pa-0">
                <v-btn v-if="work.category && work.category[0]" x-small plain>
                  #{{ work.category[0] }}
                </v-btn>
              </v-col>
              <v-col cols="12">
                <!-- TODO: liking a work has no backing endpoint yet
                     (see store/index.js). Re-enable once one exists.
                <v-btn
                  v-if="!liked"
                  x-small
                  :loading="loading"
                  color="primary"
                  @click="likeWork(work)"
                >
                  <v-icon small left> mdi-text-box-check </v-icon>
                  simpan
                </v-btn>
                <v-btn
                  v-if="liked"
                  x-small
                  color="secondary"
                  @click="dislikeWork(work)"
                >
                  <v-icon small left> mdi-text-box-minus </v-icon>
                  buang
                </v-btn>
                -->
                <v-btn
                  x-small
                  color="success"
                  nuxt
                  :to="`/work/${work.id}/read`"
                >
                  <v-icon small left> mdi-text-box-search </v-icon>
                  baca
                </v-btn>
                <v-btn
                  v-if="isOwner"
                  x-small
                  color="warning"
                  nuxt
                  :to="`/work/${work.id}/edit`"
                >
                  <v-icon small left> mdi-text-box-edit </v-icon>
                  edit
                </v-btn>
                <v-btn
                  v-if="isOwner"
                  x-small
                  color="error"
                  @click="removeWork(work.id)"
                >
                  <v-icon small left> mdi-text-box-remove </v-icon>
                  hapus
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-actions>
      </v-img>
    </v-card>
  </v-sheet>
</template>

<script>
export default {
  name: 'WorkCard',
  props: {
    work: { type: Object, required: true },
    wordLimit: { type: Object, default: () => ({ title: 100, text: 0 }) },
    miniVariant: { type: Boolean, default: false },
    mutation: { type: Boolean, default: false },
    size: {
      type: Object,
      default() {
        return {
          numbers: 100,
          units: '%',
        };
      },
    },
  },
  data: () => ({
    // liked/loading only matter for the (currently disabled) like feature -
    // see the commented-out buttons above and store/index.js.
    // liked: false,
    // loading: false,
  }),
  computed: {
    me() {
      return this.$store.getters.me;
    },
    isOwner() {
      return (
        !!this.work.writer &&
        !!this.me &&
        this.work.writer.username === this.me.username
      );
    },
  },
  methods: {
    removeWork(id) {
      this.$emit('remove-work', id);
    },
    // TODO: re-enable once liking a work has a backing endpoint.
    // likeCheck() {
    //   const likeBy = this.work.like_by || []
    //   this.liked = this.me ? likeBy.includes(this.me.id) : false
    // },
    // async likeWork(work) {
    //   try {
    //     this.loading = true
    //     await this.$store.dispatch('updateLikeList', work.id)
    //     await this.$store.dispatch('updateLikeBy', work)
    //     this.liked = true
    //   } catch (error) {
    //     console.error('Error updating like:', error)
    //   } finally {
    //     this.loading = false
    //   }
    // },
    // async dislikeWork(work) {
    //   try {
    //     this.loading = true
    //     await this.$store.dispatch('removeLikeList', work.id)
    //     await this.$store.dispatch('removeLikeBy', work)
    //     this.liked = false
    //   } catch (error) {
    //     console.error('Error removing like:', error)
    //   } finally {
    //     this.loading = false
    //   }
    // },
  },
};
</script>
