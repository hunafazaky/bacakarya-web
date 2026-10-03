<template>
  <div v-if="profile">
    <v-row align="center" class="mb-4">
      <v-col cols="auto">
        <v-avatar size="80">
          <AppImage size="200x200" :src="profile.photo" text="Photo" />
        </v-avatar>
      </v-col>

      <v-col>
        <h1 class="text-h5">{{ profile.pen_name }}</h1>
        <p class="text-body-2 text-medium-emphasis">@{{ profile.username }}</p>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.label" cols="6" sm="3">
        <v-card class="text-center pa-3" variant="tonal">
          <div class="text-h6">{{ stat.value }}</div>
          <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <p class="text-overline text-medium-emphasis mb-2">Works</p>

    <v-row v-if="ownWorks.length > 0">
      <v-col v-for="work in ownWorks" :key="work.id" cols="6" md="3" sm="4">
        <WorkCard :work="work" @delete="onDelete" />
      </v-col>
    </v-row>

    <p v-else class="text-medium-emphasis">No works yet.</p>

    <div v-if="isOwnProfile" class="mt-8">
      <v-divider class="mb-4" />
      <DeleteAccountDialog />
    </div>
  </div>

  <div v-else class="text-center text-medium-emphasis py-10">
    User not found.
  </div>
</template>

<script setup lang="ts">
import type { ApiListEnvelope, PopulatedWork, User } from '~~/shared/types'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const username = route.params.username as string
const api = useApi()
const auth = useAuthStore()
const { removeWork } = useWorkActions()

const res = await api<ApiListEnvelope<User>>('/users', {
  params: { username },
})
const profile = ref(res.data[0] ?? null)

useHead({ title: () => profile.value?.pen_name ?? 'User not found' })

const isOwnProfile = computed(() => auth.user?.username === username)

const stats = computed(() => [
  { label: 'Works Written', value: profile.value?.work_list.length ?? 0 },
  { label: 'Works Read', value: profile.value?.read_list.length ?? 0 },
  { label: 'Works Saved', value: profile.value?.like_list.length ?? 0 },
  { label: 'Ratings Given', value: profile.value?.rate_list.length ?? 0 },
])

// GET /users?username= populates work_list with full (raw) Work objects,
// but not each work's own `writer` (only GET /users/{id} goes one level
// deeper, and only for read_list.readers / like_list.writer). We already
// know the writer here - it's the profile itself - so build the minimal
// writer shape WorkCard actually needs.
const ownWorks = computed<PopulatedWork[]>(() => {
  const p = profile.value
  if (!p) return []
  return p.work_list.map((w) => ({
    ...w,
    // Cast: WorkCard/read.vue only ever read id/username/pen_name/photo off
    // a work's writer, never its own lists - a full User isn't needed here.
    writer: {
      id: p.id,
      username: p.username,
      pen_name: p.pen_name,
      photo: p.photo,
    } as User,
  }))
})

async function onDelete(id: string) {
  if (!(await removeWork(id))) {
    return
  }
  if (profile.value) {
    profile.value.work_list = profile.value.work_list.filter((w) => w.id !== id)
  }
}
</script>
