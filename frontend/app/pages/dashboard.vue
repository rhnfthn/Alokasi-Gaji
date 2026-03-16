<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Dashboard</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm text-gray-500 dark:text-gray-400">Total Balance</div>
        <div class="mt-1 text-lg font-semibold">{{ analytics.overview?.totalBalance ?? '-' }}</div>
      </div>
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm text-gray-500 dark:text-gray-400">Income (month)</div>
        <div class="mt-1 text-lg font-semibold">{{ analytics.overview?.totalIncome ?? '-' }}</div>
      </div>
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm text-gray-500 dark:text-gray-400">Expense (month)</div>
        <div class="mt-1 text-lg font-semibold">{{ analytics.overview?.totalExpense ?? '-' }}</div>
      </div>
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm text-gray-500 dark:text-gray-400">Remaining Budget</div>
        <div class="mt-1 text-lg font-semibold">{{ analytics.overview?.remainingBudget ?? '-' }}</div>
      </div>
    </div>

    <div>
      <h2 class="mb-3 text-base font-semibold">Wallets</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <WalletCard v-for="w in walletStore.wallets" :key="w.id" :wallet="w" />
        <div v-if="!walletStore.wallets.length" class="text-sm text-gray-500 dark:text-gray-400">
          No wallets yet.
        </div>
      </div>
    </div>

    <div>
      <h2 class="mb-3 text-base font-semibold">Recent Transactions</h2>
      <TransactionTable :items="transactionStore.transactions.slice(0, 10)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const walletStore = useWalletStore();
const transactionStore = useTransactionStore();
const analytics = useAnalyticsStore();

async function refresh() {
  await Promise.all([
    walletStore.fetchAll(),
    transactionStore.fetchAll(),
    analytics.fetchOverview(),
  ]);
}

useAutoRefreshOnIdle(refresh);

onMounted(() => {
  refresh();
});
</script>

