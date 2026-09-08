<template>
  <v-sheet outlined rounded="lg" min-height="200px">
    <editor-content :editor="editor" />
  </v-sheet>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

export default {
  name: 'TiptapEditor',
  components: {
    EditorContent,
  },

  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editor: null,
    };
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [StarterKit],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML());

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style>
.ProseMirror {
  padding: 8px;
  border-radius: 0.5rem;
  min-height: 200px;
}
</style>
