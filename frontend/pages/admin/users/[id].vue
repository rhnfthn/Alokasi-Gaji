<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Breadcrumb -->
      <nav class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink to="/admin/users" class="hover:text-indigo-600 dark:hover:text-indigo-400">Users</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white">{{ user.name || 'User' }}</span>
      </nav>

      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/30">
            {{ user.name?.charAt(0) || '?' }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h1>
            <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <div v-if="loading" class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        Loading user summary...
      </div>
      <div v-else-if="error" class="rounded-xl border border-gray-200 bg-white p-6 text-sm text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-red-300">
        {{ error }}
      </div>
      <template v-else>

      <!-- Stats Grid -->
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.walletCount }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Wallets</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalTransactions }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.incomeCount }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Income Entries</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
              <svg class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.expenseCount }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Expense Entries</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Info & Activity Summary -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- User Information -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 class="font-semibold text-gray-900 dark:text-white">User Information</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Full Name</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ user.email }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Role</dt>
                <dd>
                  <span :class="[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  ]">
                    {{ user.role }}
                  </span>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Registered</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(user.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Activity Summary (privacy-safe) -->
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h3 class="font-semibold text-gray-900 dark:text-white">Activity Summary</h3>
          </div>
          <div class="p-6">
            <dl class="space-y-4">
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Budgets</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.totalBudgets }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Goals</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.totalGoals }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-sm text-gray-500 dark:text-gray-400">Has Activity</dt>
                <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ stats.hasActivity ? 'Yes' : 'No' }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

const route = useRoute();

type UserSummary = {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
  };
  stats: {
    totalTransactions: number;
    incomeCount: number;
    expenseCount: number;
    totalBudgets: number;
    totalGoals: number;
    walletCount: number;
    hasActivity: boolean;
  };
};

const config = useRuntimeConfig();
const token = useCookie('access_token');

const loading = ref(true);
const error = ref('');
const summary = ref<UserSummary | null>(null);

const user = computed(() => {
  return (
    summary.value?.user ?? {
      id: String(route.params.id),
      name: '',
      email: '',
      role: 'USER' as const,
      createdAt: '',
    }
  );
});

const stats = computed(() => {
  return (
    summary.value?.stats ?? {
      totalTransactions: 0,
      incomeCount: 0,
      expenseCount: 0,
      totalBudgets: 0,
      totalGoals: 0,
      walletCount: 0,
      hasActivity: false,
    }
  );
});

function formatDate(date: string) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

async function fetchSummary() {
  loading.value = true;
  error.value = '';
  try {
    summary.value = await $fetch<UserSummary>(`${config.public.apiBase}/admin/users/${route.params.id}/summary`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Failed to load user summary';
    summary.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchSummary();
});
</script>
