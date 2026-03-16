<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Analytics</h1>
    </div>

    <AnalyticsCharts
      :spending-by-category="analyticsStore.spendingByCategory"
      :income-expense="analyticsStore.incomeExpense"
      :monthly-trend="analyticsStore.monthlyTrend"
    />
  </div>
</template>

<script setup lang="ts">
const analyticsStore = useAnalyticsStore();

async function refresh() {
  await Promise.all([
    analyticsStore.fetchSpendingCategory(),
    analyticsStore.fetchIncomeExpense(6),
    analyticsStore.fetchMonthlyTrend(6),
  ]);
}

useAutoRefreshOnIdle(refresh);

onMounted(() => {
  refresh();
});
</script>
