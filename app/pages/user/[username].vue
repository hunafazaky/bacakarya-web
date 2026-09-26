<template>
  <div v-if="profile">
    <v-row align="center" class="mb-4">
      <v-col cols="auto">
        <v-avatar size="80">
          <v-img :src="profile.photo" />
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

    <p class="text-overline text-medium-emphasis mb-2">Karya Tulis</p>

    <v-row v-if="ownWorks.length > 0">
      <v-col
        v-for="work in ownWorks"
        :key="work.id"
        cols="6"
        md="3"
        sm="4"
      >
        <WorkCard :work="work" @delete="onDelete" />
      </v-col>
    </v-row>

    <p v-else class="text-medium-emphasis">Belum ada karya tulis.</p>
  </div>

  <div v-else class="text-center text-medium-emphasis py-10">
    Pengguna tidak ditemukan.
  </div>
</template>

<script setup lang="ts">
  import type { ApiListEnvelope, PopulatedWork, User, Work } from '~~/shared/types'

  definePageMeta({ middleware: 'auth' })

  const route = useRoute()
  const username = route.params.username as string
  const api = useApi()
  const worksStore = useWorksStore()

  interface ProfileUser extends Omit<User, 'work_list' | 'read_list' | 'like_list'> {
    work_list: Work[]
    read_list: Work[]
    like_list: Work[]
  }

  const res = await api<ApiListEnvelope<ProfileUser>>('/users', { params: { username } })
  const profile = ref(res.data[0] ?? null)

  const stats = computed(() => [
    { label: 'Karya Ditulis', value: profile.value?.work_list.length ?? 0 },
    { label: 'Karya Dibaca', value: profile.value?.read_list.length ?? 0 },
    { label: 'Karya Disimpan', value: profile.value?.like_list.length ?? 0 },
    { label: 'Rating Diberikan', value: profile.value?.rate_list.length ?? 0 },
  ])

  // work_list items come back from GET /users without a populated `writer`
  // (only GET /users/{id} nested-populates that, and only for
  // read_list.readers / like_list.writer, not work_list) - but we already
  // know the writer here, it's the profile itself. Build the minimal writer
  // shape WorkCard actually needs rather than reusing the full profile type,
  // which would recursively mismatch (its own work_list is Work[], not the
  // string[] a populated User.work_list would be).
  const ownWorks = computed<PopulatedWork[]>(() => {
    const p = profile.value
    if (!p) return []
    return p.work_list.map(w => ({
      ...w,
      // Cast: WorkCard/read.vue only ever read id/username/pen_name/photo off
      // a work's writer, never its own lists - a full User isn't needed here.
      writer: { id: p.id, username: p.username, pen_name: p.pen_name, photo: p.photo } as User,
    }))
  })

  async function onDelete (id: string) {
    await worksStore.remove(id)
    if (profile.value) {
      profile.value.work_list = profile.value.work_list.filter(w => w.id !== id)
    }
  }
</script>
