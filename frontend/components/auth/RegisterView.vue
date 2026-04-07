<template>
  <div class="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-white px-4 py-10 sm:px-6">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      <div class="absolute -right-20 top-20 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
      <div class="absolute bottom-[-14rem] left-1/2 h-96 w-[44rem] -translate-x-1/2 rounded-[50%] border border-white/50 bg-white/70 blur-sm" />
    </div>

    <div class="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
      <div class="w-full rounded-3xl border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur md:p-8">
        <div class="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
          </svg>
        </div>

        <h1 class="text-center text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p class="mt-2 text-center text-sm text-slate-500">Start your finance journey with a clean dashboard.</p>

        <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 1 1-8 0" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </span>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              autocomplete="name"
              required
              placeholder="Full name"
              class="h-11 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400"
            />
          </div>

          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5h18v9H3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="m3 8 9 6 9-6" />
              </svg>
            </span>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              required
              placeholder="Email"
              class="h-11 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400"
            />
          </div>

          <div class="relative">
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              placeholder="Password"
              class="h-11 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition focus:border-slate-400"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <p class="-mt-1 text-right text-xs text-slate-500">Min 8 characters</p>

          <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {{ error }}
          </div>

          <button
            type="submit"
            class="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(15,23,42,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="mt-5 text-center text-sm text-slate-500">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-semibold text-slate-800 hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const res = await authStore.register({ name: name.value, email: email.value, password: password.value });

    const currentUser = authStore.user ?? res?.user;
    if (!currentUser && authStore.isAuthenticated) {
      await authStore.fetchProfile();
    }

    const finalUser = authStore.user ?? res?.user;
    if (!finalUser) {
      throw new Error('Registration succeeded but profile was not loaded');
    }

    await navigateTo(finalUser.role === 'ADMIN' ? '/admin' : '/dashboard');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>
