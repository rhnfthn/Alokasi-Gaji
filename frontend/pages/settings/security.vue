<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">Security</h1>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">Change password</div>
      <form class="mt-3 grid gap-3 md:grid-cols-3" @submit.prevent="save">
        <input v-model="currentPassword" type="password" placeholder="Current password" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <input v-model="newPassword" type="password" placeholder="New password" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Saving…' : 'Save' }}
        </button>
      </form>
      <div v-if="message" class="mt-3 text-sm text-gray-600 dark:text-gray-300">{{ message }}</div>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="flex gap-3 text-sm">
      <NuxtLink class="hover:underline" to="/settings/profile">Profile</NuxtLink>
      <NuxtLink class="hover:underline" to="/settings/preferences">Preferences</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentPassword = ref('');
const newPassword = ref('');
const loading = ref(false);
const error = ref('');
const message = ref('');

async function save() {
  error.value = '';
  message.value = '';
  loading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/users/change-password', {
      method: 'PATCH',
      body: { currentPassword: currentPassword.value, newPassword: newPassword.value },
    });
    message.value = 'Password changed.';
    currentPassword.value = '';
    newPassword.value = '';
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Change failed';
  } finally {
    loading.value = false;
  }
}
</script>
