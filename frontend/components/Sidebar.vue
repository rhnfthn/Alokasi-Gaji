<template>
  <aside
    class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 md:static md:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
      <NuxtLink
        to="/dashboard"
        class="flex items-center gap-2"
        title="Dashboard"
        @click="closeIfMobile"
      >
        <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-8 w-8 rounded-lg object-cover" />
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">FinFlow</span>
      </NuxtLink>

      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
        title="Close sidebar"
        @click="emit('update:open', false)"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="space-y-1 p-3 text-sm">
      <NuxtLink :class="linkClass('/dashboard')" to="/dashboard" @click="closeIfMobile">Dashboard</NuxtLink>
      <NuxtLink :class="linkClass('/wallets')" to="/wallets" @click="closeIfMobile">Wallets</NuxtLink>
      <NuxtLink :class="linkClass('/income')" to="/income" @click="closeIfMobile">Income</NuxtLink>
      <NuxtLink :class="linkClass('/expenses')" to="/expenses" @click="closeIfMobile">Expenses</NuxtLink>
      <NuxtLink :class="linkClass('/budgets')" to="/budgets" @click="closeIfMobile">Budgets</NuxtLink>
      <NuxtLink :class="linkClass('/transactions')" to="/transactions" @click="closeIfMobile">Transactions</NuxtLink>
      <NuxtLink :class="linkClass('/analytics')" to="/analytics" @click="closeIfMobile">Analytics</NuxtLink>
      <NuxtLink :class="linkClass('/goals')" to="/goals" @click="closeIfMobile">Goals</NuxtLink>
      <NuxtLink :class="linkClass('/notifications')" to="/notifications" @click="closeIfMobile">Notifications</NuxtLink>
      <NuxtLink :class="linkClass('/support/chat')" to="/support/chat" @click="closeIfMobile">
        <span class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Live Chat
        </span>
      </NuxtLink>
      <NuxtLink :class="linkClass('/settings/profile')" to="/settings/profile" @click="closeIfMobile">Settings</NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    open?: boolean;
  }>(),
  {
    open: false,
  },
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const route = useRoute();

const open = computed(() => Boolean(props.open));

function isActive(path: string) {
  if (path === '/dashboard') return route.path === '/' || route.path.startsWith('/dashboard');
  return route.path.startsWith(path);
}

function linkClass(path: string) {
  const base = 'block rounded px-3 py-2 transition-colors';
  return isActive(path)
    ? `${base} bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100`
    : `${base} text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800`;
}

function closeIfMobile() {
  if (import.meta.client && window.matchMedia('(max-width: 767px)').matches) {
    emit('update:open', false);
  }
}
</script>
