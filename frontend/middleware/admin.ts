export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for admin login page
  if (to.path === '/admin/login') {
    return;
  }

  // Check if accessing admin routes
  if (!to.path.startsWith('/admin')) {
    return;
  }

  const authStore = useAuthStore();

  // Not authenticated -> redirect to admin login
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login');
  }

  // Fetch profile if not loaded
  if (!authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      await authStore.logout('/admin/login');
      return navigateTo('/admin/login');
    }
  }

  // Check for admin role
  if (authStore.user?.role !== 'ADMIN') {
    return navigateTo('/admin/login');
  }
});
