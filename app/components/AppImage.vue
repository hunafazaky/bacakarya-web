<template>
  <v-img :src="displaySrc" v-bind="$attrs" @error="onError" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string | null
    /** WxH for the placeholder, e.g. '400x600' for a cover, '200x200' for an avatar. */
    size?: string
    text?: string
  }>(),
  {
    src: null,
    size: '400x400',
    text: 'BacaKarya',
  }
)

const failed = ref(false)

const fallback = computed(
  () =>
    `https://placehold.co/${props.size}?text=${encodeURIComponent(props.text)}`
)

const displaySrc = computed(() =>
  !props.src || failed.value ? fallback.value : props.src
)

// Reset the failure flag if a new (hopefully working) src comes in.
watch(
  () => props.src,
  () => {
    failed.value = false
  }
)

function onError() {
  failed.value = true
}
</script>
