<template>
  <div>
    <v-row :justify="works.length > 0 ? 'start' : 'center'">
      <v-col cols="8">
        <template v-if="foryou && foryou.length > 0">
          <p class="overline text-center text-secondary ma-4">Rekomendasi</p>
          <v-row class="mt-0">
            <v-col
              v-for="work in foryouPreview"
              :key="work.id"
              class="px-1 py-0"
              cols="4"
            >
              <WorkCard
                :work="work"
                :wordLimit="{ title: 100, text: 0 }"
                :miniVariant="false"
                :mutation="false"
                @remove-work="deleteWork"
              />
            </v-col>
          </v-row>
        </template>

        <p class="overline text-center text-secondary ma-4">Paling Baru</p>
        <v-row class="mt-0">
          <LoadingComponent
            v-if="loadingWorks && works.length === 0"
            :loading="true"
          />
          <template v-else-if="works.length > 0">
            <v-col
              v-for="work in works"
              :key="work.id"
              class="px-1 py-0"
              cols="4"
            >
              <WorkCard
                :work="work"
                :wordLimit="{ title: 100, text: 0 }"
                :miniVariant="false"
                :mutation="false"
                @remove-work="deleteWork"
              />
            </v-col>
            <v-col v-if="loadingWorks" class="px-1 py-0" cols="4">
              <div class="loading-indicator">Loading more works...</div>
            </v-col>
          </template>
          <template v-else>
            <p class="overline text-center text-secondary ma-4">
              Belum ada karya tulis
            </p>
          </template>
        </v-row>
      </v-col>

      <v-col cols="4">
        <v-card v-if="me" rounded="lg" fixed outlined>
          <v-card-text>
            <nuxt-link
              :to="`/user/${me.username}`"
              class="text-decoration-none black--text text-truncate"
            >
              <v-avatar class="mr-1" size="36">
                <v-img :src="me.photo"></v-img>
              </v-avatar>
              <span
                class="title text-capitalize font-weight-bold"
                v-text="me.pen_name"
              ></span>
            </nuxt-link>
          </v-card-text>
          <v-divider />
          <v-card-title class="overline py-2 font-weight-bold"
            >Terakhir ditulis</v-card-title
          >
          <v-card-text>
            <template v-if="me.work_list && me.work_list.length > 0">
              <nuxt-link
                v-for="work in me.work_list.slice(0, 5)"
                :key="work.id"
                :to="`/work/${work.id}/read`"
                class="text-decoration-none text--secondary"
              >
                <p v-text="work.title"></p>
              </nuxt-link>
            </template>
            <p v-else class="text--disabled">Belum menulis apa pun</p>
          </v-card-text>
          <v-divider />
          <v-card-title class="overline py-2 font-weight-bold"
            >Terakhir dibaca</v-card-title
          >
          <v-card-text>
            <template v-if="me.read_list && me.read_list.length > 0">
              <nuxt-link
                v-for="read in me.read_list.slice(0, 5)"
                :key="read.id"
                :to="`/work/${read.id}/read`"
                class="text-decoration-none text--secondary"
              >
                <p v-text="read.title"></p>
              </nuxt-link>
            </template>
            <p v-else class="text--disabled">Belum membaca apa pun</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WorkCard from '../components/WorkCard.vue'
import LoadingComponent from '../components/LoadingComponent.vue'
import currentUser from '../mixins/currentUser'
import workListScroll from '../mixins/workListScroll'

export default {
  name: 'Home',
  middleware: 'auth',
  mixins: [currentUser, workListScroll],
  components: {
    WorkCard,
    LoadingComponent,
  },
  computed: {
    foryou() {
      return this.$store.getters.foryou
    },
    foryouPreview() {
      return (this.foryou || []).slice(0, 6)
    },
  },
  methods: {
    // Refresh the sidebar's "recently written" list after deleting a work
    // (see mixins/workListScroll.js).
    afterWorkDeleted() {
      if (this.me) this.$store.dispatch('getUserById', this.me.id)
    },
  },
  mounted() {
    this.$store.dispatch('getForYou')
  },
}
</script>
