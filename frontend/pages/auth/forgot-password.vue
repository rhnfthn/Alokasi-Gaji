<template>
  <div class="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-10 sm:px-6">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      <div class="absolute -right-20 top-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
      <div class="absolute bottom-[-14rem] left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-[50%] border border-white/50 bg-white/70 blur-sm" />
    </div>

    <div class="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
      <div class="w-full rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
        <template v-if="!submitted">
          <div class="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </div>

          <h1 class="text-center text-2xl font-semibold tracking-tight text-slate-900">Forgot password?</h1>
          <p class="mt-2 text-center text-sm text-slate-500">Enter your email and we will send a reset link.</p>

          <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
            <div class="relative">
              <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9H3z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m3 8 9 6 9-6" />
                </svg>
              </span>
              <input
                v-model.trim="email"
                type="email"
                autocomplete="email"
                required
                placeholder="Email"
                class="h-11 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400"
              />
            </div>

            <div v-if="message" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {{ message }}
            </div>

            <button
              type="submit"
              class="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(15,23,42,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Sending...' : 'Send reset link' }}
            </button>
          </form>

          <p class="mt-5 text-center text-sm text-slate-500">
            Remember your password?
            <NuxtLink to="/auth/login" class="font-semibold text-slate-800 hover:underline">Back to login</NuxtLink>
          </p>
        </template>

        <template v-else>
          <div class="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="text-center text-2xl font-semibold tracking-tight text-slate-900">Check your email</h2>
          <p class="mt-2 text-center text-sm text-slate-500">
            We sent a reset link to <span class="font-semibold text-slate-800">{{ email }}</span>.
          </p>

          <button
            type="button"
            class="mt-7 h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
            @click="onResend"
          >
            {{ loading ? 'Resending...' : 'Resend email' }}
          </button>

          <p class="mt-5 text-center text-sm text-slate-500">
            <NuxtLink to="/auth/login" class="font-semibold text-slate-800 hover:underline">Back to login</NuxtLink>
          </p>
        </template>
      </div>
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
