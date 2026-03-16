export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // Admin routes have their own auth/role middleware.
  if (to.path.startsWith('/admin')) {
    return;
  }

  // Public landing page
  if (to.path === '/') {
    return;
  }

  const isAuthRoute = to.path.startsWith('/auth');
  if (isAuthRoute) {
    return;
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }

  if (!authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      await authStore.logout();
    }
  }
});
