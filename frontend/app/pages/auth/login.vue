<template>
  <div>
    <h1 class="text-xl font-semibold">Login</h1>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Welcome back.</p>

    <form class="mt-6 space-y-3" @submit.prevent="onSubmit">
      <div>
        <label class="text-sm">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900" />
      </div>
      <div>
        <label class="text-sm">Password</label>
        <input v-model="password" type="password" class="mt-1 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-900" />
      </div>

      <div v-if="error" class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
        {{ error }}
      </div>

      <button
        class="w-full rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>

      <div class="flex items-center justify-between text-sm">
        <NuxtLink class="text-gray-700 hover:underline dark:text-gray-200" to="/auth/register">Create account</NuxtLink>
        <NuxtLink class="text-gray-700 hover:underline dark:text-gray-200" to="/auth/forgot-password">Forgot password</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });

    if (!authStore.user && authStore.isAuthenticated) {
      await authStore.fetchProfile();
    }

    if (!authStore.user) {
      throw new Error('Login succeeded but profile was not loaded');
    }

    await navigateTo(authStore.user.role === 'ADMIN' ? '/admin' : '/dashboard');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
