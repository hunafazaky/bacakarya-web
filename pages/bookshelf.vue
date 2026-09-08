<template>
  <div>
    <v-row v-if="likesDisabled" justify="center" class="px-4 py-2">
      <p class="overline text-center text-secondary ma-4">
        Fitur simpan karya belum tersedia
      </p>
    </v-row>
    <v-row
      v-else
      :justify="works.length > 0 ? 'start' : 'center'"
      class="px-4 py-2"
    >
      <LoadingComponent v-if="loading" :loading="true" />
      <template v-else-if="works.length > 0">
        <v-col
          v-for="work in works"
          :key="work.id"
          class="px-1 py-0"
          cols="4"
          sm="4"
          md="3"
          xl="2"
        >
          <WorkCard
            :work="work"
            :wordLimit="{ title: 100, text: 0 }"
            :miniVariant="false"
            :mutation="false"
            @remove-work="deleteWork"
          />
        </v-col>
      </template>
      <template v-else>
        <p class="overline text-center text-secondary ma-4">Kosong</p>
      </template>
    </v-row>
  </div>
</template>

<script>
import WorkCard from '../components/WorkCard.vue'
import LoadingComponent from '../components/LoadingComponent.vue'
import currentUser from '../mixins/currentUser'

// TODO: this whole page is built around `me.like_list`, which is populated
// by the "like a work" feature - currently disabled because the API has no
// endpoint for it yet (see store/index.js). Once that exists, flip
// `likesDisabled` off and this should work as-is.
export default {
  name: 'Bookshelf',
  middleware: 'auth',
  mixins: [currentUser],
  data: () => ({
    likesDisabled: true,
    loading: true,
    works: [],
  }),
  methods: {
    async getWorks() {
      this.loading = true
      const likeList = this.me?.like_list || []
      try {
        this.works = await Promise.all(
          likeList.map((id) => this.$store.dispatch('getWorkById', id))
        )
      } catch (error) {
        console.error('Gagal memuat rak buku:', error)
      } finally {
        this.loading = false
      }
    },
    deleteWork(id) {
      if (!window.confirm('Apakah anda ingin menghapus karya tulis ini??'))
        return
      this.$store.dispatch('deleteWork', id).then(() => {
        this.getWorks()
      })
    },
  },
  mounted() {
    if (!this.likesDisabled) this.getWorks()
  },
}
</script>
