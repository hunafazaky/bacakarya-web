<template>
  <v-row v-if="work">
    <v-col cols="12" md="8">
      <h1 class="text-h4 mb-4">{{ work.title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-body-1" v-html="safeText" />
    </v-col>

    <v-col cols="12" md="4">
      <v-card>
        <AppImage
          cover
          height="200"
          size="400x600"
          :src="work.cover"
          :text="work.title"
        />

        <v-card-text>
          <div class="mb-3">
            <p class="text-caption font-weight-bold mb-0">Penulis</p>

            <NuxtLink
              class="text-decoration-none"
              :to="`/user/${work.writer.username}`"
            >
              {{ work.writer.pen_name }}
            </NuxtLink>
          </div>

          <div v-if="work.category?.length" class="mb-3">
            <p class="text-caption font-weight-bold mb-0">Kategori</p>

            <v-chip
              v-for="cat in work.category"
              :key="cat"
              class="mr-1"
              size="small"
              variant="tonal"
            >
              #{{ cat }}
            </v-chip>
          </div>

          <div v-if="work.attachment?.link" class="mb-3">
            <p class="text-caption font-weight-bold mb-0">Lampiran</p>

            <v-btn
              :href="work.attachment.link"
              prepend-icon="mdi-file-pdf-box"
              size="small"
              target="_blank"
              variant="tonal"
            >
              {{ work.attachment.title }}
            </v-btn>
          </div>

          <v-btn
            block
            class="mb-3"
            :color="isLiked ? 'secondary' : 'primary'"
            :loading="likeLoading"
            @click="toggleLike"
          >
            <v-icon start>{{
              isLiked ? 'mdi-bookmark-remove' : 'mdi-bookmark-plus'
            }}</v-icon>
            {{ isLiked ? 'Buang dari simpanan' : 'Simpan' }}
          </v-btn>

          <v-btn
            v-if="isOwner"
            block
            class="mb-3"
            :to="`/work/${workId}/edit`"
            variant="tonal"
          >
            <v-icon start>mdi-pencil</v-icon>
            Edit
          </v-btn>

          <div>
            <p class="text-caption font-weight-bold mb-0">Beri rating</p>

            <v-rating
              v-model="rating"
              hover
              length="5"
              size="28"
              @update:model-value="submitRating"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import DOMPurify from 'isomorphic-dompurify'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const workId = route.params.id as string
const auth = useAuthStore()
const worksStore = useWorksStore()

const work = ref(await worksStore.fetchById(workId))
const likeLoading = ref(false)

const safeText = computed(() => DOMPurify.sanitize(work.value?.text || ''))

const isLiked = computed(() => {
  const user = auth.user
  return !!user && user.like_list.some((w) => w.id === workId)
})

const isOwner = computed(() => auth.user?.id === work.value?.writer.id)

const rating = ref(
  auth.user?.rate_list?.find((r) => r.work_id === workId)?.rating ?? 0
)

async function toggleLike() {
  const currentWork = work.value
  if (!currentWork) return
  likeLoading.value = true
  try {
    work.value = isLiked.value
      ? await worksStore.unlike(currentWork.id)
      : await worksStore.like(currentWork.id)
  } finally {
    likeLoading.value = false
  }
}

async function submitRating(value: string | number) {
  const currentWork = work.value
  const user = auth.user
  if (!currentWork || !user) return
  await worksStore.rate(currentWork.id, user.id, Number(value))
}

onMounted(() => {
  const currentWork = work.value
  if (currentWork) worksStore.markRead(currentWork.id)
})
</script>
