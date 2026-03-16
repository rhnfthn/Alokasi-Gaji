type AutoRefreshOnIdleOptions = {
  idleMs?: number;
};

export function useAutoRefreshOnIdle(
  refresh: () => void | Promise<void>,
  options: AutoRefreshOnIdleOptions = {},
) {
  const idleMs = options.idleMs ?? 8000;

  if (!import.meta.client) return;

  const { idle } = useIdle(idleMs);
  const refreshedDuringThisIdle = ref(false);

  watch(idle, async (isIdle) => {
    if (!isIdle) {
      refreshedDuringThisIdle.value = false;
      return;
    }

    if (refreshedDuringThisIdle.value) return;
    refreshedDuringThisIdle.value = true;

    try {
      await refresh();
    } catch {
      // ignore refresh errors
    }
  });
}
