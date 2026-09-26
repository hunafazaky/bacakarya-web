<template>
  <div class="tiptap-editor">
    <v-toolbar color="surface-variant" density="compact" flat>
      <v-btn
        icon="mdi-format-bold"
        size="small"
        :variant="editor?.isActive('bold') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleBold().run()"
      />

      <v-btn
        icon="mdi-format-italic"
        size="small"
        :variant="editor?.isActive('italic') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleItalic().run()"
      />

      <v-btn
        icon="mdi-format-list-bulleted"
        size="small"
        :variant="editor?.isActive('bulletList') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />

      <v-btn
        icon="mdi-format-list-numbered"
        size="small"
        :variant="editor?.isActive('orderedList') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      />

      <v-btn
        icon="mdi-format-quote-close"
        size="small"
        :variant="editor?.isActive('blockquote') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      />
    </v-toolbar>

    <EditorContent class="tiptap-content" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
  import StarterKit from '@tiptap/starter-kit'
  import { Editor, EditorContent } from '@tiptap/vue-3'

  const props = defineProps<{ modelValue: string }>()
  const emit = defineEmits<{ 'update:model-value': [value: string] }>()

  const editor = shallowRef<Editor>()

  onMounted(() => {
    editor.value = new Editor({
      content: props.modelValue,
      extensions: [StarterKit],
      onUpdate: ({ editor: e }) => emit('update:model-value', e.getHTML()),
    })
  })

  // Keep the editor in sync if modelValue is replaced from outside (e.g. edit
  // page's asyncData resolving after the editor already mounted).
  watch(
    () => props.modelValue,
    value => {
      if (editor.value && value !== editor.value.getHTML()) {
        editor.value.commands.setContent(value, { emitUpdate: false })
      }
    },
  )

  onBeforeUnmount(() => {
    editor.value?.destroy()
  })
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
}
.tiptap-content :deep(.ProseMirror) {
  padding: 16px;
  min-height: 200px;
  outline: none;
}
</style>
