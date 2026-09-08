<template>
  <div>
    <v-row :justify="works.length > 0 ? 'start' : 'center'">
      <v-col>
        <v-row class="mt-0">
          <Hashtags @hashtag-actived="onHashtagChanged" />
        </v-row>

        <v-row class="mt-4">
          <LoadingComponent
            v-if="loadingWorks && works.length === 0"
            :loading="true"
          />
          <template v-else-if="works.length > 0">
            <v-col
              v-for="work in works"
              :key="work.id"
              class="px-1 py-0"
              cols="3"
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
            <p class="overline text-center text-secondary ma-4">Kosong</p>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import WorkCard from '../components/WorkCard.vue'
import Hashtags from '../components/Hashtags.vue'
import LoadingComponent from '../components/LoadingComponent.vue'
import currentUser from '../mixins/currentUser'
import workListScroll from '../mixins/workListScroll'

export default {
  name: 'Explore',
  middleware: 'auth',
  mixins: [currentUser, workListScroll],
  components: {
    WorkCard,
    Hashtags,
    LoadingComponent,
  },
  data: () => ({
    category: '',
  }),
  methods: {
    onHashtagChanged(category) {
      this.category = category || ''
      this.resetWorks()
    },
  },
}
</script>
