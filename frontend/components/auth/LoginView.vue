<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Form Section -->
    <div class="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center justify-center gap-2">
          <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-10 w-10 rounded-lg object-cover" />
          <span class="text-xl font-semibold text-gray-900">FinFlow</span>
        </NuxtLink>

        <h2 class="mt-8 text-center text-2xl font-semibold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-gray-900 hover:underline">Sign up</NuxtLink>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="rounded-xl border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-10">
          <form class="space-y-5" @submit.prevent="onSubmit">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                v-model.trim="email"
                type="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
                class="mt-1.5 block h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
              />
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <NuxtLink to="/auth/forgot-password" class="text-sm text-gray-600 hover:text-gray-900">Forgot password?</NuxtLink>
              </div>
              <div class="relative mt-1.5">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  placeholder="Enter your password"
                  class="block h-10 w-full rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            </div>

            <div class="flex items-center">
              <input
                id="remember"
                v-model="remember"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 bg-white text-gray-900 focus:ring-0 focus:ring-offset-0"
              />
              <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
            </div>

            <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {{ error }}
            </div>

            <button
              type="submit"
              class="flex h-10 w-full items-center justify-center rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </form>
        </div>

        <p class="mt-6 text-center text-xs text-gray-500">
          By signing in, you agree to our
          <a href="#" class="hover:text-gray-700">Terms</a> and
          <a href="#" class="hover:text-gray-700">Privacy Policy</a>.
        </p>
      </div>
    </div>

    <!-- Image Section (hidden on mobile) -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-12">
        <img src="/assets/bg/finflow.png" alt="FinFlow" class="h-auto w-full max-w-lg rounded-2xl object-contain shadow-2xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);

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
