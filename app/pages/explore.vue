<template>
  <div>
    <v-chip-group
      v-model="selectedCategory"
      class="mb-4"
      filter
      mandatory-false
      @update:model-value="onCategoryChange"
    >
      <v-chip v-for="cat in CATEGORIES" :key="cat" :value="cat" variant="tonal">
        {{ categoryLabel(cat) }}
      </v-chip>
    </v-chip-group>

    <v-row>
      <v-col
        v-if="loading && works.length === 0"
        class="text-center py-10"
        cols="12"
      >
        <v-progress-circular color="primary" indeterminate />
      </v-col>

      <template v-else-if="works.length > 0">
        <v-col v-for="work in works" :key="work.id" cols="6" md="3" sm="4">
          <WorkCard :work="work" @delete="deleteWork" />
        </v-col>
      </template>

      <v-col v-else class="text-center text-medium-emphasis py-10" cols="12">
        Nothing here yet.
      </v-col>
    </v-row>

    <div v-if="loading && works.length > 0" class="text-center py-6">
      <v-progress-circular color="primary" indeterminate size="24" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const selectedCategory = ref<string | undefined>(undefined)
const { works, loading, reset, deleteWork } = useWorkList(
  () => selectedCategory.value
)

function onCategoryChange() {
  reset()
}
</script>
