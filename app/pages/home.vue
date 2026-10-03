<template>
  <div>
    <template v-if="recommendations.length > 0">
      <p class="text-overline text-medium-emphasis mb-2">Recommended</p>

      <v-row class="mb-6">
        <v-col
          v-for="work in recommendations"
          :key="work.id"
          cols="6"
          md="3"
          sm="4"
        >
          <WorkCard :work="work" @delete="onDeleteRecommendation" />
        </v-col>
      </v-row>
    </template>

    <p class="text-overline text-medium-emphasis mb-2">Latest</p>

    <v-row>
      <v-col
        v-if="loading && works.length === 0"
        class="text-center py-10"
        cols="12"
      >
        <AppSpinner />
      </v-col>

      <template v-else-if="works.length > 0">
        <v-col v-for="work in works" :key="work.id" cols="6" md="3" sm="4">
          <WorkCard :work="work" @delete="onDeleteLatest" />
        </v-col>
      </template>

      <v-col
        v-else-if="!error"
        class="text-center text-medium-emphasis py-10"
        cols="12"
      >
        No works yet.
      </v-col>
    </v-row>

    <div v-if="loading && works.length > 0" class="text-center py-6">
      <AppSpinner :size="24" />
    </div>

    <div v-if="error" class="text-center py-6">
      <p class="text-medium-emphasis mb-2">Couldn't load works.</p>
      <v-btn variant="tonal" @click="retry">Try again</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PopulatedWork } from '~~/shared/types'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Home' })

const auth = useAuthStore()
const worksStore = useWorksStore()
const { removeWork } = useWorkActions()
const { works, loading, error, retry, deleteWork } = useWorkList()

const recommendations = ref<PopulatedWork[]>([])
onMounted(async () => {
  const user = auth.user
  if (user) {
    try {
      recommendations.value = await worksStore.fetchRecommendations(user.id)
    } catch {
      // Optional section: if it can't load, just leave it hidden.
    }
  }
})

// A work can appear in both lists, so removing it from one removes it from
// the other too.
async function onDeleteLatest(id: string) {
  if (await deleteWork(id)) {
    recommendations.value = recommendations.value.filter((w) => w.id !== id)
  }
}

async function onDeleteRecommendation(id: string) {
  if (await removeWork(id)) {
    recommendations.value = recommendations.value.filter((w) => w.id !== id)
    works.value = works.value.filter((w) => w.id !== id)
  }
}
</script>
