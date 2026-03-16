<template>
  <div class="overflow-x-auto rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <tr>
          <th class="px-4 py-2">Date</th>
          <th class="px-4 py-2">Type</th>
          <th class="px-4 py-2">Category</th>
          <th class="px-4 py-2">Wallet</th>
          <th class="px-4 py-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in items"
          :key="t.id"
          class="border-b border-gray-100 last:border-b-0 dark:border-gray-800"
        >
          <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ formatDate(t.date) }}</td>
          <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ t.type }}</td>
          <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ t.category || '-' }}</td>
          <td class="px-4 py-2 text-gray-900 dark:text-gray-100">{{ t.wallet?.name || t.walletId }}</td>
          <td class="px-4 py-2 text-right text-gray-900 dark:text-gray-100">{{ formatRupiah(t.amount) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/stores/transactionStore';

defineProps<{ items: Transaction[] }>();

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}
</script>

