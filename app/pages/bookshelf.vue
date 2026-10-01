<template>
  <div>
    <v-row v-if="loading" class="py-10" justify="center">
      <v-progress-circular color="primary" indeterminate />
    </v-row>

    <v-row v-else-if="works.length > 0">
      <v-col v-for="work in works" :key="work.id" cols="6" md="3" sm="4">
        <WorkCard :work="work" @delete="onDelete" />

        <v-btn
          block
          class="mt-1"
          size="small"
          variant="text"
          @click="unlike(work.id)"
        >
          Remove from bookshelf
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else justify="center">
      <v-col class="text-center text-medium-emphasis py-10" cols="12">
        No saved works yet.
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { ApiEnvelope, PopulatedWork } from '~~/shared/types'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const worksStore = useWorksStore()
const api = useApi()

const works = ref<PopulatedWork[]>([])
const loading = ref(true)

async function load() {
  const user = auth.user
  if (!user) return
  loading.value = true
  try {
    // GET /users/{id} (unlike GET /users?username=) populates one level
    // deeper: each like_list work comes back with its `writer` populated
    // too (the `UserDetail` schema in openapi.yaml) - which WorkCard
    // needs, since it reads work.writer.pen_name.
    const res = await api<ApiEnvelope<{ like_list: PopulatedWork[] }>>(
      `/users/${user.id}`
    )
    works.value = res.data.like_list
  } finally {
    loading.value = false
  }
}

async function unlike(id: string) {
  await worksStore.unlike(id)
  works.value = works.value.filter((w) => w.id !== id)
}

async function onDelete(id: string) {
  await worksStore.remove(id)
  works.value = works.value.filter((w) => w.id !== id)
}

onMounted(load)
</script>
