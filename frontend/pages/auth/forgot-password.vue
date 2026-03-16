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
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          >
            <span class="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main class="flex flex-1 items-center justify-center p-6">
        <!-- Form state -->
        <div
          v-if="!submitted"
          class="w-full max-w-[480px] space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12"
        >
          <div class="flex flex-col gap-2">
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span class="material-symbols-outlined text-3xl text-primary">lock_reset</span>
            </div>
            <h1 class="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Forgot password?</h1>
            <p class="text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              No worries, it happens to the best of us. Enter your email and we'll send you a secure link to reset your account access.
            </p>
          </div>

          <form class="space-y-6" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <label class="text-sm font-semibold leading-normal text-slate-900 dark:text-slate-200">Email address</label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                <input
                  v-model.trim="email"
                  class="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  placeholder="e.g. name@company.com"
                  required
                  type="email"
                  autocomplete="email"
                />
              </div>
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
              <span>{{ loading ? 'Sending…' : 'Send reset link' }}</span>
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

        <!-- Success state -->
        <div
          v-else
          class="w-full max-w-[480px] space-y-6 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-12"
        >
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span class="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Check your email</h2>
          <p class="text-slate-500 dark:text-slate-400">
            We've sent a password reset link to <span class="font-semibold text-slate-900 dark:text-white">{{ email }}</span>. Please check your inbox and spam folder.
          </p>
          <button
            class="h-12 w-full rounded-lg border border-slate-200 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            type="button"
            :disabled="loading"
            @click="onResend"
          >
            {{ loading ? 'Resending…' : 'Resend email' }}
          </button>
          <NuxtLink class="inline-flex items-center text-sm font-semibold text-primary hover:underline" to="/auth/login">
            Back to login
          </NuxtLink>
        </div>
      </main>

      <footer class="p-8 text-center">
        <p class="text-xs text-slate-400">
          ©  FinFlow Inc. All rights reserved. |
          <a class="underline hover:text-primary" href="#">Privacy Policy</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth-full' });

const email = ref('');
const loading = ref(false);
const message = ref('');
const submitted = ref(false);

async function onSubmit() {
  const { $api } = useNuxtApp();
  message.value = '';
  loading.value = true;
  try {
    await $api<{ success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    });
    submitted.value = true;
  } catch (e: any) {
    message.value = e?.data?.message ?? e?.message ?? 'Request failed';
  } finally {
    loading.value = false;
  }
}

async function onResend() {
  submitted.value = false;
  await onSubmit();
}
</script>
