<template>
  <div>
    <h1 class="text-xl font-semibold">Forgot password</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Request a reset token.</p>

    <form class="mt-6 space-y-3" @submit.prevent="onSubmit">
      <div>
        <label class="text-sm">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900" />
      </div>

      <div v-if="message" class="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
        {{ message }}
      </div>

      <button
        class="w-full rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Requesting…' : 'Request reset' }}
      </button>

      <div class="text-sm">
        <NuxtLink class="text-gray-700 hover:underline dark:text-gray-200" to="/auth/login">Back to login</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const email = ref('');
const loading = ref(false);
const message = ref('');

async function onSubmit() {
  const { $api } = useNuxtApp();
  message.value = '';
  loading.value = true;
  try {
    const res = await $api<{ success: boolean; token?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    });

    message.value = res.token
      ? `Reset token (dev): ${res.token}`
      : 'If the email exists, a reset token has been issued.';
  } catch (e: any) {
    message.value = e?.data?.message ?? e?.message ?? 'Request failed';
  } finally {
    loading.value = false;
  }
}
</script>
