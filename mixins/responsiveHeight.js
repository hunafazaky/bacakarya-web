// Maps the current Vuetify breakpoint to a pixel value used to decide when
// the nav drawer collapses / the login illustration is shown.
//
// This was previously copy-pasted verbatim into ~6 files. Most of them never
// actually used it in their template (dead code) - only layouts/default.vue
// and pages/index.vue do, so this mixin is only applied to those two now.
export default {
  computed: {
    height() {
      const heights = {
        xs: 220,
        sm: 400,
        md: 500,
        lg: 600,
        xl: 800,
      };
      // Default to the 'md' breakpoint's value if Vuetify ever reports an
      // unrecognised name, instead of silently returning undefined.
      return heights[this.$vuetify.breakpoint.name] ?? heights.md;
    },
  },
};
