// Redirects to the login page if there's no logged-in user in the store.
//
// This replaces the old pattern (repeated in ~7 page files) of doing the
// redirect inside a `computed: { me() {...} }` getter. Computed properties
// are supposed to be pure and are only evaluated when something in the
// template actually reads them - which meant the redirect silently never
// ran in some files (e.g. layouts/default.vue) because nothing referenced
// `me` in the template. Middleware always runs, before the page mounts.
export default function ({ store, redirect }) {
  if (!store.getters.me) {
    return redirect('/');
  }
}
