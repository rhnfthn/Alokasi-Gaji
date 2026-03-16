<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">Profile</h1>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">User</div>
      <div class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ authStore.user?.email }}</div>
      <div v-if="authStore.user?.avatar" class="mt-3">
        <img :src="avatarSrc" alt="avatar" class="h-16 w-16 rounded border border-gray-200 object-cover dark:border-gray-800" />
      </div>

      <div class="mt-4">
        <label class="text-sm">Upload avatar</label>
        <input ref="avatarInput" type="file" class="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" @change="uploadAvatar" />
        <div v-if="message" class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ message }}</div>
      </div>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">Update profile</div>
      <form class="mt-3 grid gap-3 md:grid-cols-3" @submit.prevent="save">
        <input v-model="form.name" placeholder="Name" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <input v-model="form.email" placeholder="Email" type="email" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Saving…' : 'Save' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="flex gap-3 text-sm">
      <NuxtLink class="hover:underline" to="/settings/security">Security</NuxtLink>
      <NuxtLink class="hover:underline" to="/settings/preferences">Preferences</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveApiUrl } from '~/composables/useApiAssetUrl';

const authStore = useAuthStore();

const avatarSrc = computed(() => {
  const raw = authStore.user?.avatar;
  if (!raw) return '';
  const resolved = resolveApiUrl(raw);
  if (!resolved) return '';
  const buster = authStore.avatarBuster;
  if (!buster) return resolved;
  const sep = resolved.includes('?') ? '&' : '?';
  return `${resolved}${sep}v=${buster}`;
});

const form = ref({ name: authStore.user?.name ?? '', email: authStore.user?.email ?? '' });
const loading = ref(false);
const error = ref('');
const message = ref('');

const avatarInput = ref<HTMLInputElement | null>(null);

watch(
  () => authStore.user,
  (u) => {
    if (!u) return;
    form.value.name = u.name;
    form.value.email = u.email;
  },
  { immediate: true },
);

async function save() {
  error.value = '';
  loading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/users/me', {
      method: 'PATCH',
      body: { name: form.value.name, email: form.value.email },
    });
    await authStore.fetchProfile();
    message.value = 'Saved.';
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Save failed';
  } finally {
    loading.value = false;
  }
}

async function uploadAvatar() {
  const file = avatarInput.value?.files?.[0];
  if (!file) return;

  message.value = '';
  error.value = '';
  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const fd = new FormData();
    fd.append('file', file);

    const res = await $fetch<{ success: boolean; url?: string }>(`${config.public.apiBase}/upload/avatar`, {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (res.success) {
      await authStore.fetchProfile();
      message.value = 'Avatar updated.';
    } else {
      error.value = 'Upload failed';
    }
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Upload failed';
  } finally {
    loading.value = false;
  }
}
</script>
