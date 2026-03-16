<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">Preferences</h1>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">App settings</div>
      <form class="mt-3 grid gap-3 md:grid-cols-3" @submit.prevent="save">
        <input v-model="defaultCurrency" placeholder="Default currency (e.g. USD)" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="darkMode" type="checkbox" class="h-4 w-4" />
          Dark mode
        </label>
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Saving…' : 'Save' }}
        </button>
      </form>
      <div v-if="message" class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ message }}</div>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="flex gap-3 text-sm">
      <NuxtLink class="hover:underline" to="/settings/profile">Profile</NuxtLink>
      <NuxtLink class="hover:underline" to="/settings/security">Security</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
type Settings = { id: string; userId: string; defaultCurrency?: string | null; darkMode?: boolean | null };

const loading = ref(false);
const error = ref('');
const message = ref('');

const defaultCurrency = ref('USD');
const darkMode = ref(false);

async function load() {
  error.value = '';
  try {
    const { $api } = useNuxtApp();
    const s = await $api<Settings>('/settings');
    defaultCurrency.value = s.defaultCurrency || 'USD';
    darkMode.value = Boolean(s.darkMode);
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Load failed';
  }
}

async function save() {
  error.value = '';
  message.value = '';
  loading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/settings', {
      method: 'PATCH',
      body: { defaultCurrency: defaultCurrency.value, darkMode: darkMode.value },
    });
    message.value = 'Saved.';
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Save failed';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  load();
});
</script>
