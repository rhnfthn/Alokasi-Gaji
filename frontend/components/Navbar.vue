<template>
  <header class="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
    <div class="flex items-center justify-between px-4 py-3 md:px-6">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
          title="Open sidebar"
          @click="emit('toggle-sidebar')"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-8 w-8 rounded-lg object-cover" />
          <span class="text-sm font-medium">FinFlow</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="rounded border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
          type="button"
          @click="toggleTheme"
        >
          {{ theme === 'dark' ? 'Dark' : 'Light' }}
        </button>

        <div class="hidden text-sm text-gray-600 dark:text-gray-300 md:block">
          {{ authStore.user?.email }}
        </div>

        <button
          class="rounded bg-gray-900 px-3 py-1 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          type="button"
          @click="() => authStore.logout()"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'toggle-sidebar'): void;
}>();

const authStore = useAuthStore();

const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');

function applyTheme() {
  if (!import.meta.client) return;
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
}

watchEffect(applyTheme);
</script>
