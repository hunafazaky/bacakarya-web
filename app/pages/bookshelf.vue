<template>
  <div>
    <v-row v-if="loading" class="py-10" justify="center">
      <AppSpinner />
    </v-row>

    <v-row v-else-if="error" class="py-10" justify="center">
      <v-col class="text-center" cols="12">
        <p class="text-medium-emphasis mb-2">Couldn't load your bookshelf.</p>
        <v-btn variant="tonal" @click="load">Try again</v-btn>
      </v-col>
    </v-row>

    <v-row v-else-if="works.length > 0">
      <!-- Column stack: the card takes the leftover height, the button sits
           under it. (The card is height: 100%, so a plain sibling button used
           to push past the row's bottom edge into the next row.) -->
      <v-col
        v-for="work in works"
        :key="work.id"
        class="d-flex flex-column"
        cols="6"
        md="3"
        sm="4"
      >
        <WorkCard class="flex-grow-1" :work="work" @delete="onDelete" />

        <v-btn
          block
          class="mt-2 flex-shrink-0"
          size="small"
          variant="tonal"
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
useHead({ title: 'Bookshelf' })

const auth = useAuthStore()
const worksStore = useWorksStore()
const notify = useNotifyStore()
const { removeWork } = useWorkActions()
const api = useApi()

const works = ref<PopulatedWork[]>([])
const loading = ref(true)
const error = ref(false)

async function load() {
  const user = auth.user
  if (!user) return
  loading.value = true
  error.value = false
  try {
    // GET /users/{id} (unlike GET /users?username=) populates one level
    // deeper: each like_list work comes back with its `writer` populated
    // too (the `UserDetail` schema in openapi.yaml) - which WorkCard
    // needs, since it reads work.writer.pen_name.
    const res = await api<ApiEnvelope<{ like_list: PopulatedWork[] }>>(
      `/users/${user.id}`
    )
    works.value = res.data.like_list
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

async function unlike(id: string) {
  try {
    await worksStore.unlike(id)
    works.value = works.value.filter((w) => w.id !== id)
  } catch (error_) {
    notify.fail(
      error_,
      "Couldn't remove it from your bookshelf. Please try again."
    )
  }
}

async function onDelete(id: string) {
  if (await removeWork(id)) {
    works.value = works.value.filter((w) => w.id !== id)
  }
}

onMounted(load)
</script>
