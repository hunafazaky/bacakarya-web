<template>
  <div>
    <template v-if="recommendations.length > 0">
      <p class="text-overline text-medium-emphasis mb-2">Rekomendasi</p>

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

    <p class="text-overline text-medium-emphasis mb-2">Paling Baru</p>

    <v-row>
      <v-col v-if="loading && works.length === 0" class="text-center py-10" cols="12">
        <v-progress-circular color="primary" indeterminate />
      </v-col>

      <template v-else-if="works.length > 0">
        <v-col
          v-for="work in works"
          :key="work.id"
          cols="6"
          md="3"
          sm="4"
        >
          <WorkCard :work="work" @delete="deleteWork" />
        </v-col>
      </template>

      <v-col v-else class="text-center text-medium-emphasis py-10" cols="12">
        Belum ada karya tulis.
      </v-col>
    </v-row>

    <div v-if="loading && works.length > 0" class="text-center py-6">
      <v-progress-circular color="primary" indeterminate size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { PopulatedWork } from '~~/shared/types'

  definePageMeta({ middleware: 'auth' })

  const auth = useAuthStore()
  const worksStore = useWorksStore()
  const { works, loading, deleteWork } = useWorkList()

  const recommendations = ref<PopulatedWork[]>([])
  onMounted(async () => {
    const user = auth.user
    if (user) {
      recommendations.value = await worksStore.fetchRecommendations(user.id)
    }
  })

  async function onDeleteRecommendation (id: string) {
    await worksStore.remove(id)
    recommendations.value = recommendations.value.filter(w => w.id !== id)
  }
</script>
