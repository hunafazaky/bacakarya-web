// Exposes the logged-in user as `this.me`.
//
// Previously this was a computed property duplicated in ~7 files that ALSO
// redirected to '/' when there was no user - mixing a pure "read the state"
// concern with a "navigation guard" concern. That's why it broke in
// different ways in different files (see middleware/auth.js for the fix to
// the guard itself). This mixin only does the read.
export default {
  computed: {
    me() {
      return this.$store.getters.me;
    },
  },
};
