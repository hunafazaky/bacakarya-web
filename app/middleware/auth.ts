export default defineNuxtRouteMiddleware(() => {
  // While an error page is showing (e.g. the startup page when the backend is
  // asleep) there is no user to check, and redirecting to the login page would
  // replace that page with a misleading logged-out screen.
  const error = useError()
  if (error.value) {
    return
  }

  const auth = useAuthStore()
  if (!auth.isLoggedIn) {
    return navigateTo('/')
  }
})
