<template>
  <div>
    <LoadingPage :loading="loading" />
    <v-row v-if="work" justify="space-between">
      <PopZoom
        max-width="500px"
        :image="work.cover"
        :show-pop-zoom="showPopZoom"
        @hide-pop-zoom="showPopZoom = false"
      />
      <v-col class="my-5" cols="12" md="7">
        <h1
          class="headline font-weight-medium text--secondary"
          v-text="work.title"
        ></h1>
        <!-- SECURITY TODO (deferred): this is raw HTML from the editor with no
             sanitization. Fine while it's just us testing, but run it through
             something like DOMPurify before there's real user-generated content. -->
        <p class="subtitle-1 my-5" v-html="work.text"></p>
      </v-col>
      <v-col class="my-5" cols="12" md="4">
        <v-card rounded="lg" outlined>
          <v-card-text>
            <v-row justify="center">
              <v-col sm="6" md="12">
                <v-sheet
                  outlined
                  rounded="lg"
                  width="100%"
                  class="overflow-hidden zoom-in-pointer"
                  :style="{
                    'padding-top': 100 * (19 / 13) + '%',
                    position: 'relative',
                  }"
                  @click.stop="showPopZoom = true"
                >
                  <v-img
                    style="inset: 0; position: absolute"
                    height="100%"
                    cover
                    :src="work.cover"
                  ></v-img>
                </v-sheet>
              </v-col>
              <v-col sm="6" md="12">
                <div v-if="work.writer" class="my-5">
                  <p class="caption font-weight-bold my-0">Penulis :</p>
                  <nuxt-link
                    :to="`/user/${work.writer.username}`"
                    class="text-decoration-none"
                  >
                    <div
                      class="caption text-truncate text-capitalize font-weight-medium"
                      v-text="work.writer.pen_name"
                    ></div>
                  </nuxt-link>
                </div>
                <div
                  v-if="work.category && work.category.length > 0"
                  class="my-5"
                >
                  <p class="caption font-weight-bold my-0">Kategori :</p>
                  <span
                    v-for="category in work.category"
                    :key="category"
                    class="overline font-weight-bold"
                  >
                    #{{ category }}
                  </span>
                </div>
                <div
                  v-if="work.attachment && work.attachment.link"
                  class="my-5"
                >
                  <p class="caption font-weight-bold my-0">Lampiran :</p>
                  <v-btn
                    color="error"
                    class="my-2 white--text truncate"
                    block
                    :max-width="150"
                    @click="openLink(work.attachment.link)"
                  >
                    <v-icon left dark>mdi-file-pdf-box</v-icon>
                    <span class="text-truncate" style="max-width: 150px">
                      {{ work.attachment.title }}
                    </span>
                  </v-btn>
                </div>
                <div class="my-5">
                  <p class="caption font-weight-bold my-0">
                    Berikan Penilaian Anda
                  </p>
                  <v-rating
                    v-model="rating"
                    hover
                    :length="5"
                    :size="32"
                    @input="sendRating"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PopZoom from '~/components/PopZoom.vue';
import LoadingPage from '~/components/LoadingPage.vue';
import currentUser from '~/mixins/currentUser';

export default {
  name: 'Read',
  components: { PopZoom, LoadingPage },
  mixins: [currentUser],
  middleware: 'auth',
  data: () => ({
    showPopZoom: false,
    loading: true,
    rating: null,
  }),
  computed: {
    work() {
      return this.$store.getters.work;
    },
  },
  mounted() {
    this.getRating();
    this.loadWork();
  },
  methods: {
    getRating() {
      const rateList = this.me?.rate_list || [];
      const found = rateList.find(
        (item) => item.work_id === this.$route.params.id
      );
      this.rating = found?.rating ?? null;
    },
    async loadWork() {
      this.loading = true;
      try {
        await this.$store.dispatch('getWorkById', this.$route.params.id);
        // TODO: marking a work as "read" (readers/read_list) has no backing
        // endpoint yet - see store/index.js. Re-enable when one exists:
        // await this.$store.dispatch('updateReadList', work.id)
        // await this.$store.dispatch('updateReaders', work)
      } catch (error) {
        console.error('Error fetching work:', error);
      } finally {
        this.loading = false;
      }
    },
    sendRating() {
      // PUT /recommendations is the one real, documented way to submit a
      // rating - it's expected to update the work/user's rating records
      // server-side, so we don't PUT those directly ourselves.
      this.$store
        .dispatch('updateRecommender', this.rating)
        .catch((error) => console.error('Error updating rating:', error));
    },
    openLink(link) {
      window.open(link, '_blank');
    },
  },
};
</script>
