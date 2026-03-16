<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
    <div class="layout-container flex h-full grow flex-col">
      <header
        class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 md:px-20"
      >
        <div class="flex items-center gap-3 text-slate-900 dark:text-slate-100">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span class="material-symbols-outlined text-xl">account_balance_wallet</span>
          </div>
          <h2 class="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">FinFlow</h2>
        </div>
      </header>

      <main class="flex flex-1 items-center justify-center p-6">
        <div
          class="w-full max-w-[480px] space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12"
        >
          <div class="flex flex-col gap-2">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span class="material-symbols-outlined text-3xl text-primary">lock_reset</span>
            </div>
            <h1 class="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Reset password</h1>
            <p class="text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              Paste your reset token and choose a new password.
            </p>
          </div>

          <form class="space-y-6" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <label class="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200">Reset token</label>
              <input
                v-model.trim="token"
                class="h-14 w-full rounded-lg border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="Enter reset token"
                required
                type="text"
                autocomplete="one-time-code"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200">New password</label>
              <input
                v-model="password"
                class="h-14 w-full rounded-lg border border-slate-200 bg-white px-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                placeholder="••••••••"
                required
                type="password"
                autocomplete="new-password"
              />
            </div>

            <div
              v-if="message"
              class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200"
            >
              {{ message }}
            </div>

            <button
              class="flex h-14 w-full items-center justify-center rounded-lg bg-primary text-base font-bold leading-normal text-white shadow-lg shadow-primary/20 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              :disabled="loading"
            >
              {{ loading ? 'Resetting…' : 'Reset password' }}
              <span class="material-symbols-outlined ml-2 text-lg">arrow_forward</span>
            </button>
          </form>

          <div class="flex flex-col items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <NuxtLink class="group flex items-center text-sm font-semibold text-primary hover:underline" to="/auth/login">
              <span class="material-symbols-outlined mr-2 text-base transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to login
            </NuxtLink>
          </div>
        </div>
      </main>

      <footer class="p-8 text-center">
        <p class="text-xs text-slate-400">
          © 2026 FinFlow Inc. All rights reserved. |
          <a class="underline hover:text-primary" href="#">Privacy Policy</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth-full' });

const route = useRoute();
const token = ref((route.query.token as string) || '');
const password = ref('');
const loading = ref(false);
const message = ref('');

async function onSubmit() {
  const { $api } = useNuxtApp();
  message.value = '';
  loading.value = true;
  try {
    await $api('/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value },
    });
    message.value = 'Password reset. You can now login.';
  } catch (e: any) {
    message.value = e?.data?.message ?? e?.message ?? 'Reset failed';
  } finally {
    loading.value = false;
  }
}
</script>
