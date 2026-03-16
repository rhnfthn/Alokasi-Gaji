<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Transaction</h1>
      <NuxtLink class="text-sm hover:underline" to="/transactions">Back</NuxtLink>
    </div>

    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading...</div>

    <div v-else class="rounded border border-gray-200 bg-white p-4 text-sm dark:border-gray-800 dark:bg-gray-900">
      <div><span class="text-gray-500 dark:text-gray-400">ID:</span> {{ tx?.id }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Type:</span> {{ tx?.type }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Category:</span> {{ tx?.category || '-' }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Wallet:</span> {{ tx?.wallet?.name || tx?.walletId }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Amount:</span> {{ tx ? formatRupiah(tx.amount) : '-' }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Date:</span> {{ tx?.date }}</div>
      <div><span class="text-gray-500 dark:text-gray-400">Note:</span> {{ tx?.note || '-' }}</div>
    </div>

    <div v-if="error" class="text-sm text-red-600 dark:text-red-300">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/stores/transactionStore';

const route = useRoute();
const transactionStore = useTransactionStore();

const loading = ref(true);
const error = ref('');
const tx = ref<Transaction | null>(null);

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    tx.value = await transactionStore.getById(route.params.id as string);
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Load failed';
  } finally {
    loading.value = false;
  }
});
</script>