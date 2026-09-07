<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card class="mb-2" rounded="lg" outlined>
        <v-card-text>
          <v-row>
            <v-col cols="4" md="3">
              <v-sheet
                outlined
                rounded="lg"
                width="100%"
                class="overflow-hidden"
                :style="{
                  'padding-top': 100 * (19 / 13) + '%',
                  position: 'relative',
                }"
              >
                <v-img
                  style="inset: 0; position: absolute"
                  v-if="work.cover"
                  height="100%"
                  cover
                  :src="work.cover"
                ></v-img>
                <v-icon v-else style="inset: 0; position: absolute" x-large>
                  mdi-plus-box
                </v-icon>
              </v-sheet>
              <p class="caption text--secondary text-center">Preview</p>
            </v-col>
            <v-col cols="8" md="9">
              <v-text-field
                outlined
                dense
                label="Judul"
                hint="Pilih judul yang sesuai dan menarik pembaca"
                persistent-hint
                required
                v-model="work.title"
              ></v-text-field>
              <v-autocomplete
                outlined
                dense
                multiple
                hide-selected
                small-chips
                deletable-chips
                clearable
                label="Tagar"
                hint="Pilih (max. 5) tagar yang paling sesuai"
                persistent-hint
                :counter="5"
                :items="hashtags"
                v-model="work.category"
              ></v-autocomplete>
              <v-file-input
                outlined
                dense
                clearable
                prepend-icon=""
                append-outer-icon="mdi-image-plus"
                show-size
                truncate-length="25"
                label="Cover"
                hint="Direkomendasikan cover dengan ratio 13:19"
                persistent-hint
                v-model="file"
                @change="fileToImage"
              ></v-file-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div>Tulis karyamu di kotak ini</div>
              <client-only>
                <tiptap-editor v-model="work.text" />
              </client-only>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="loading"
            class="ma-2 px-4"
            color="success"
            :disabled="!work.title || !work.text"
            @click="putWork"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-alert
        class="mb-0"
        type="success"
        transition="slide-y-transition"
        :value="success"
      >
        Data Berhasil Dikirim
      </v-alert>
      <v-alert
        class="mb-0"
        type="error"
        transition="slide-y-transition"
        :value="!!errorMessage"
      >
        {{ errorMessage }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import TiptapEditor from '~/components/TiptapEditor.vue'
import currentUser from '~/mixins/currentUser'

export default {
  name: 'Edit',
  middleware: 'auth',
  mixins: [currentUser],
  // NOTE: this used to fetch the work into a { content: {...}, keyword: {...} }
  // shape that didn't match what write.vue / the store / WorkCard use
  // everywhere else (flat title/text/cover/category). Normalized to match.
  async asyncData({ params, $axios }) {
    const work = await $axios.$get(`/works/${params.id}`)
    return {
      work: {
        id: work.id || work._id,
        title: work.title,
        text: work.text,
        cover: work.cover,
        category: work.category || [],
        attachment: work.attachment || {},
        writer: work.writer,
      },
    }
  },
  data: () => ({
    file: null,
    loading: false,
    success: false,
    errorMessage: '',
  }),
  computed: {
    hashtags() {
      const hashtags = []
      this.$store.state.hashtags.data.forEach((element) => {
        hashtags.push(element.name)
      })
      return hashtags
    },
  },
  methods: {
    putWork() {
      this.loading = true
      this.errorMessage = ''
      this.$store
        .dispatch('updateWork', this.work)
        .then(() => {
          this.success = true
          setTimeout(() => {
            this.$router.push('/home')
          }, 1000)
        })
        .catch((error) => {
          console.error('Error updating work:', error)
          this.errorMessage =
            'Gagal memperbarui karya tulis. Silakan coba lagi.'
        })
        .finally(() => {
          this.loading = false
        })
    },
    fileToImage() {
      if (this.file) {
        if (this.work.cover && this.work.cover.startsWith('blob:')) {
          URL.revokeObjectURL(this.work.cover)
        }
        this.work.cover = URL.createObjectURL(this.file)
      }
    },
  },
  components: { TiptapEditor },
  beforeDestroy() {
    if (this.work.cover && this.work.cover.startsWith('blob:')) {
      URL.revokeObjectURL(this.work.cover)
    }
  },
}
</script>
