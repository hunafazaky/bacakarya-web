<template>
  <v-row justify="center" align="center" v-if="profile">
    <PopZoom
      maxWidth="500px"
      :image="profile.photo"
      :showPopZoom="showPopZoom"
      @hidePopZoom="showPopZoom = false"
    />
    <v-col cols="4">
      <v-sheet
        width="100%"
        class="overflow-hidden"
        style="padding-top: 100%; position: relative"
      >
        <v-avatar
          color="secondary"
          size="100%"
          class="pa-1 zoom-in-pointer"
          style="inset: 0; position: absolute"
          @click="showPopZoom = true"
        >
          <v-img :src="profile.photo"></v-img>
        </v-avatar>
      </v-sheet>
    </v-col>
    <v-col cols="8">
      <v-card rounded="lg" outlined>
        <v-card-text>
          <div class="d-flex">
            <p class="my-1 font-weight-black overline">Pen Name / Username</p>
            <v-spacer></v-spacer>
            <p class="my-1 font-weight-black overline">
              {{ profile.pen_name }} / {{ profile.username }}
            </p>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <div class="d-flex">
            <p class="my-1 font-weight-light">Jumlah karya yang ditulis</p>
            <v-spacer></v-spacer>
            <p class="my-1 font-weight-light">
              {{ profile.work_list?.length || 0 }}
            </p>
          </div>
          <div class="d-flex">
            <p class="my-1 font-weight-light">Jumlah karya yang dibaca</p>
            <v-spacer></v-spacer>
            <p class="my-1 font-weight-light">
              {{ profile.read_list?.length || 0 }}
            </p>
          </div>
          <div class="d-flex">
            <p class="my-1 font-weight-light">Jumlah karya yang disimpan</p>
            <v-spacer></v-spacer>
            <p class="my-1 font-weight-light">
              {{ profile.like_list?.length || 0 }}
            </p>
          </div>
          <div class="d-flex">
            <p class="my-1 font-weight-light">
              Jumlah karya yang diberi rating
            </p>
            <v-spacer></v-spacer>
            <p class="my-1 font-weight-light">
              {{ profile.rate_list?.length || 0 }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card rounded="lg" outlined width="100%">
        <v-card-title class="ma-2">Karya Tulis Saya</v-card-title>
        <v-card-text>
          <v-row
            v-if="profile.work_list && profile.work_list.length > 0"
            justify="start"
            class="px-4 py-1"
          >
            <v-col
              v-for="work in profile.work_list"
              :key="work._id"
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
                :mutation="isOwnProfile"
                @remove-work="deleteWork"
              />
            </v-col>
          </v-row>
          <p v-else class="overline text-center text-secondary ma-4">Kosong</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import WorkCard from '~/components/WorkCard.vue'
import PopZoom from '~/components/PopZoom.vue'
import currentUser from '~/mixins/currentUser'

export default {
  name: 'UserProfile',
  middleware: 'auth',
  mixins: [currentUser],
  data: () => ({
    showPopZoom: false,
    profile: null,
  }),
  computed: {
    isOwnProfile() {
      return this.me?.username === this.$route.params.username
    },
  },
  methods: {
    async fetchProfile() {
      // Viewing your own profile doesn't need a network round-trip - the
      // full user object is already in the store.
      if (this.isOwnProfile) {
        this.profile = this.me
        return
      }
      try {
        const res = await this.$axios.get('/users', {
          params: { username: this.$route.params.username },
        })
        this.profile = res.data[0] || null
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },
    deleteWork(id) {
      if (!window.confirm('Apakah anda ingin menghapus karya tulis ini??'))
        return
      this.$store.dispatch('deleteWork', id).then(() => {
        this.fetchProfile()
      })
    },
  },
  components: { WorkCard, PopZoom },
  mounted() {
    this.fetchProfile()
  },
}
</script>
