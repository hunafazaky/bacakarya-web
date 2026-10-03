export default defineNuxtPlugin(async () => {
  // When Nuxt renders the error page it does a second pass over the app, with
  // the error already set. Don't call the API again then: if the backend is
  // asleep that would just wait out another timeout before showing the page.
  const error = useError()
  if (error.value) {
    return
  }

  const auth = useAuthStore()
  await auth.restoreSession()
})
