<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Transactions</h1>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm font-semibold">Export CSV</div>
        <div class="mt-2 flex gap-2">
          <button
            type="button"
            class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            @click="doExport"
          >
            Export
          </button>
          <button
            v-if="csvText"
            type="button"
            class="rounded border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            @click="copyCsv"
          >
            Copy
          </button>
        </div>
        <textarea
          v-if="csvText"
          v-model="csvText"
          class="mt-3 h-40 w-full rounded border border-gray-200 bg-white p-2 text-xs dark:border-gray-800 dark:bg-gray-950"
        />
      </div>

      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm font-semibold">Import CSV</div>
        <textarea
          v-model="importText"
          class="mt-3 h-40 w-full rounded border border-gray-200 bg-white p-2 text-xs dark:border-gray-800 dark:bg-gray-950"
          placeholder="Paste CSV here"
        />
        <div class="mt-2">
          <button
            type="button"
            class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            @click="doImport"
          >
            Import
          </button>
        </div>
        <div v-if="message" class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ message }}</div>
      </div>
    </div>

    <TransactionTable :items="transactionStore.transactions" />

    <div class="text-sm text-gray-600 dark:text-gray-300">
      Click a transaction id in the API detail page: open /transactions/:id manually.
    </div>
  </div>
</template>

<script setup lang="ts">
const transactionStore = useTransactionStore();

useAutoRefreshOnIdle(() => transactionStore.fetchAll());

const csvText = ref('');
const importText = ref('');
const message = ref('');

async function doExport() {
  message.value = '';
  try {
    csvText.value = await transactionStore.exportCsv();
  } catch (e: any) {
    message.value = e?.data?.message ?? e?.message ?? 'Export failed';
  }
}

async function copyCsv() {
  if (!import.meta.client) return;
  await navigator.clipboard.writeText(csvText.value);
}

async function doImport() {
  message.value = '';
  try {
    const res = await transactionStore.importCsv(importText.value);
    message.value = `Imported: ${res.created}`;
    await transactionStore.fetchAll();
  } catch (e: any) {
    message.value = e?.data?.message ?? e?.message ?? 'Import failed';
  }
}

onMounted(() => {
  transactionStore.fetchAll();
});
</script>
