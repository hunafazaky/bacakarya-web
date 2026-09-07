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
                  v-if="fileOfCover"
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
              <!-- <v-radio-group class="my-0" v-model="work.category[0]" mandatory>
                <template v-slot:label>
                  <div>Pilih jenis Karya Tulis</div>
                </template>
                <v-radio
                  value="Fiksi"
                  off-icon="mdi-pound-box"
                  on-icon="mdi-pound-box"
                  color="purple"
                >
                  <template v-slot:label>
                    <div>Fiksi</div>
                  </template>
                </v-radio>
                <v-radio
                  value="Non-Fiksi"
                  off-icon="mdi-pound-box"
                  on-icon="mdi-pound-box"
                  color="error"
                >
                  <template v-slot:label>
                    <div>Non-Fiksi</div>
                  </template>
                </v-radio>
              </v-radio-group> -->
              <!-- <v-divider></v-divider> -->
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
                append-outer-icon="mdi-file-image-plus"
                show-size
                truncate-length="25"
                label="Cover"
                hint="Direkomendasikan cover dengan ratio 13:19"
                persistent-hint
                v-model="fileOfCover"
                @change="fileToImage"
              ></v-file-input>
              <v-btn-toggle v-model="attachment_type" class="mb-2">
                <v-btn>
                  <v-icon>mdi-link-box</v-icon>
                </v-btn>
                <v-btn>
                  <v-icon>mdi-file-pdf-box</v-icon>
                </v-btn>
              </v-btn-toggle>
              <v-row v-if="attachment_type === 0">
                <v-col cols="12" sm="5">
                  <v-text-field
                    outlined
                    dense
                    label="Judul"
                    v-model="work.attachment.title"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="7">
                  <v-text-field
                    outlined
                    dense
                    label="Link"
                    hint="Lampirkan tautan (Optional)"
                    persistent-hint
                    required
                    v-model="work.attachment.link"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-file-input
                v-if="attachment_type === 1"
                outlined
                dense
                clearable
                prepend-icon=""
                append-outer-icon="mdi-file-document-plus"
                show-size
                truncate-length="25"
                label="File PDF"
                hint="Lampirkan file PDF (Optional)"
                persistent-hint
                v-model="fileOfAttachment"
              ></v-file-input>
              <!-- @change="fileToLink" -->
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
            @click="postWork"
          >
            Unggah
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
import currentUser from '../mixins/currentUser'

export default {
  name: 'Write',
  middleware: 'auth',
  mixins: [currentUser],
  data: () => ({
    loading: false,
    fileOfCover: null,
    fileOfAttachment: null,
    success: false,
    errorMessage: '',
    work: {
      title: null,
      cover: null,
      attachment: {},
      writer: null,
      category: [],
      text: null,
    },
    attachment_type: null,
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
    async uploadFileToStorage(file) {
      const storageRef = this.$fireModule.storage().ref()
      // Namespace by timestamp so two uploads with the same filename (e.g.
      // "cover.jpg" from two different users) don't overwrite each other.
      const fileRef = storageRef.child(`${Date.now()}-${file.name}`)
      try {
        await fileRef.put(file)
        return fileRef.getDownloadURL()
      } catch (error) {
        console.error('Error uploading file:', error)
        throw error
      }
    },
    async postWork() {
      this.loading = true
      this.errorMessage = ''
      try {
        this.work.writer = this.me.id

        // Upload cover
        if (this.fileOfCover) {
          this.work.cover = await this.uploadFileToStorage(this.fileOfCover)
        } else {
          this.work.cover = '/temp-profile.webp'
        }

        // Upload attachment
        if (this.fileOfAttachment) {
          const attachmentLink = await this.uploadFileToStorage(
            this.fileOfAttachment
          )
          this.work.attachment = {
            title: this.fileOfAttachment.name,
            link: attachmentLink,
          }
        } else if (this.work.attachment.link) {
          if (!this.work.attachment.title) {
            this.work.attachment.title = 'Lampiran'
          }
        } else {
          this.work.attachment = {}
        }

        await this.$store.dispatch('postWork', this.work)

        this.success = true
        setTimeout(() => {
          this.$router.push('/home')
        }, 1000)
      } catch (error) {
        console.error('Error uploading work:', error)
        this.errorMessage = 'Gagal mengunggah karya tulis. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },
    fileToImage() {
      if (this.fileOfCover) {
        if (this.work.cover && this.work.cover.startsWith('blob:')) {
          URL.revokeObjectURL(this.work.cover)
        }
        this.work.cover = URL.createObjectURL(this.fileOfCover)
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
