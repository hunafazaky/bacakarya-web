// Actions on a work that several pages share, with failure feedback built in
// (previously a failed delete threw from a click handler and the user saw
// nothing).
export function useWorkActions() {
  const worksStore = useWorksStore()
  const notify = useNotifyStore()

  // Resolves true when the work was deleted. On failure the user gets a
  // message and it resolves false, so callers only update their list on true.
  async function removeWork(id: string): Promise<boolean> {
    try {
      await worksStore.remove(id)
      return true
    } catch (error_) {
      notify.fail(error_, "Couldn't delete the work. Please try again.")
      return false
    }
  }

  return { removeWork }
}
