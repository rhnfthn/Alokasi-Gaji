import { useAuthStore } from '~/stores/authStore';
import { unref } from 'vue';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const token = unref(authStore.accessToken);
      if (token) {
        options.headers = {
          ...(options.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${token}`,
        };
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
