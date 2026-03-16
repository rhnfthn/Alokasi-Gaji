<template>
  <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ budget.month }}/{{ budget.year }}</div>
        <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ budget.category }}</div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-500 dark:text-gray-400">Budget</div>
        <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ formatRupiah(budget.amount) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Budget } from '~/stores/budgetStore';

defineProps<{ budget: Budget }>();
</script>

