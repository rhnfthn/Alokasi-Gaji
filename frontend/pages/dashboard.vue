<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'User' }}
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's your financial overview for {{ currentMonth }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <svg class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ formatCurrency(analytics.overview?.totalBalance ?? 0) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
            <svg class="h-5 w-5 text-emerald-600 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Income</p>
            <p class="text-lg font-semibold text-emerald-600 dark:text-emerald-500">+{{ formatCurrency(analytics.overview?.totalIncome ?? 0) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
            <svg class="h-5 w-5 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
            <p class="text-lg font-semibold text-red-600 dark:text-red-500">-{{ formatCurrency(analytics.overview?.totalExpense ?? 0) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <svg class="h-5 w-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Remaining Budget</p>
            <p class="text-lg font-semibold" :class="(analytics.overview?.remainingBudget ?? 0) >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500'">
              {{ formatCurrency(analytics.overview?.remainingBudget ?? 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Wallets -->
      <div class="lg:col-span-2">
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-4">
            <h2 class="font-medium text-gray-900 dark:text-gray-100">My Wallets</h2>
            <NuxtLink to="/wallets" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">View all</NuxtLink>
          </div>
          <div class="p-5">
            <div v-if="walletStore.wallets.length === 0" class="py-8 text-center">
              <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg class="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">No wallets yet</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create your first wallet to get started</p>
              <NuxtLink to="/wallets" class="mt-3 inline-block rounded-lg bg-gray-900 dark:bg-gray-100 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200">
                Add Wallet
              </NuxtLink>
            </div>
            <div v-else class="grid gap-3 sm:grid-cols-2">
              <div
                v-for="wallet in walletStore.wallets.slice(0, 4)"
                :key="wallet.id"
                class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700"
              >
                <div class="flex items-center gap-3">
                  <div :class="['flex h-9 w-9 items-center justify-center rounded-lg', getWalletBg(wallet.type)]">
                    <svg :class="['h-4 w-4', getWalletColor(wallet.type)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="wallet.type === 'BANK'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      <path v-else-if="wallet.type === 'EWALLET'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      <path v-else-if="wallet.type === 'CARD'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{{ wallet.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ wallet.type }}</p>
                  </div>
                </div>
                <p class="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">{{ formatCurrency(Number(wallet.balance)) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Goals -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
          <h3 class="mb-4 font-medium text-gray-900 dark:text-gray-100">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink to="/income" class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <svg class="h-4 w-4 text-emerald-600 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Add Income</span>
            </NuxtLink>
            <NuxtLink to="/expenses" class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                <svg class="h-4 w-4 text-red-600 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Add Expense</span>
            </NuxtLink>
            <NuxtLink to="/budgets" class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <svg class="h-4 w-4 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Set Budget</span>
            </NuxtLink>
            <NuxtLink to="/analytics" class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <svg class="h-4 w-4 text-purple-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Analytics</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Goals -->
        <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100">Savings Goals</h3>
            <NuxtLink to="/goals" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">View all</NuxtLink>
          </div>
          <div class="p-4">
            <div v-if="goals.length === 0" class="py-4 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">No goals yet</p>
              <NuxtLink to="/goals" class="mt-1 inline-block text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline">
                Create your first goal
              </NuxtLink>
            </div>
            <div v-else class="space-y-3">
              <div v-for="goal in goals.slice(0, 3)" :key="goal.id" class="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <div class="mb-2 flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ goal.title }}</p>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ Math.round((goal.currentAmount / goal.targetAmount) * 100) }}%</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    class="h-full rounded-full bg-gray-900 dark:bg-gray-100"
                    :style="{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }"
                  />
                </div>
                <div class="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ formatCurrency(goal.currentAmount) }}</span>
                  <span>{{ formatCurrency(goal.targetAmount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-4">
        <h2 class="font-medium text-gray-900 dark:text-gray-100">Recent Transactions</h2>
        <NuxtLink to="/transactions" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">View all</NuxtLink>
      </div>
      <div class="p-5">
        <div v-if="transactionStore.transactions.length === 0" class="py-8 text-center">
          <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <svg class="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">No transactions yet</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by adding income or expenses</p>
        </div>
        <TransactionTable v-else :items="transactionStore.transactions.slice(0, 8)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const walletStore = useWalletStore();
const transactionStore = useTransactionStore();
const analytics = useAnalyticsStore();
const config = useRuntimeConfig();
const token = useCookie('access_token');

const loading = ref(false);
const goals = ref<any[]>([]);

const currentMonth = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

function formatCurrency(amount: number) {
  return formatRupiah(amount);
}

function getWalletBg(type: string) {
  switch (type) {
    case 'BANK': return 'bg-blue-50';
    case 'EWALLET': return 'bg-purple-50';
    case 'CARD': return 'bg-amber-50';
    case 'CASH': return 'bg-emerald-50';
    default: return 'bg-gray-100';
  }
}

function getWalletColor(type: string) {
  switch (type) {
    case 'BANK': return 'text-blue-600';
    case 'EWALLET': return 'text-purple-600';
    case 'CARD': return 'text-amber-600';
    case 'CASH': return 'text-emerald-600';
    default: return 'text-gray-600';
  }
}

async function fetchGoals() {
  try {
    goals.value = await $fetch<any[]>(`${config.public.apiBase}/goals`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch (err) {
    console.error('Failed to fetch goals:', err);
  }
}

async function refresh() {
  loading.value = true;
  try {
    await Promise.all([
      walletStore.fetchAll(),
      transactionStore.fetchAll(),
      analytics.fetchOverview(),
      fetchGoals(),
    ]);
  } finally {
    loading.value = false;
  }
}

useAutoRefreshOnIdle(refresh);

onMounted(() => {
  refresh();
});
</script>

