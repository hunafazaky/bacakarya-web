<template>
  <div class="tiptap-editor">
    <v-toolbar border="b" color="surface-light" density="compact" flat>
      <v-btn
        aria-label="Bold"
        :aria-pressed="!!editor?.isActive('bold')"
        icon="mdi-format-bold"
        size="small"
        :variant="editor?.isActive('bold') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleBold().run()"
      />

      <v-btn
        aria-label="Italic"
        :aria-pressed="!!editor?.isActive('italic')"
        icon="mdi-format-italic"
        size="small"
        :variant="editor?.isActive('italic') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleItalic().run()"
      />

      <v-btn
        aria-label="Bulleted list"
        :aria-pressed="!!editor?.isActive('bulletList')"
        icon="mdi-format-list-bulleted"
        size="small"
        :variant="editor?.isActive('bulletList') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleBulletList().run()"
      />

      <v-btn
        aria-label="Numbered list"
        :aria-pressed="!!editor?.isActive('orderedList')"
        icon="mdi-format-list-numbered"
        size="small"
        :variant="editor?.isActive('orderedList') ? 'tonal' : 'text'"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      />

      <v-btn
        aria-label="Quote"
        :aria-pressed="!!editor?.isActive('blockquote')"
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
    // Same typography as the reader (see assets/styles/prose.css).
    editorProps: { attributes: { class: 'prose' } },
    onUpdate: ({ editor: e }) => emit('update:model-value', e.getHTML()),
  })
})

// Keep the editor in sync if modelValue is replaced from outside (e.g. edit
// page's asyncData resolving after the editor already mounted).
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value, { emitUpdate: false })
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor {
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
}
/* Visible keyboard focus for the whole editor, not just the caret. */
.tiptap-editor:focus-within {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
}
/* Reserve the editor's height up front: it is created after mount, so
   without this the box would jump from toolbar-only to full height. */
.tiptap-content {
  min-height: 240px;
}
.tiptap-content :deep(.ProseMirror) {
  min-height: 240px;
  max-width: none;
  padding: 16px 20px;
  outline: none;
}
</style>
