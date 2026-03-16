<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Transactions</h1>
      <button
        type="button"
        class="flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        @click="downloadExcel"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Excel
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Export CSV</div>
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
            class="rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="copyCsv"
          >
            Copy
          </button>
        </div>
        <textarea
          v-if="csvText"
          v-model="csvText"
          class="mt-3 h-40 w-full rounded border border-gray-200 bg-white p-2 text-xs text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
        />
      </div>

      <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="text-sm font-semibold text-gray-900 dark:text-gray-100">Import CSV</div>
        <textarea
          v-model="importText"
          class="mt-3 h-40 w-full rounded border border-gray-200 bg-white p-2 text-xs text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
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

function downloadExcel() {
  const transactions = transactionStore.transactions;
  if (!transactions.length) {
    message.value = 'No transactions to export';
    return;
  }

  // Create Excel-compatible CSV with BOM for proper UTF-8 encoding
  const headers = ['Date', 'Type', 'Category', 'Wallet', 'Amount', 'Description'];
  const rows = transactions.map((t: any) => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.category || '-',
    t.wallet?.name || t.walletId || '-',
    t.amount,
    t.description || '-'
  ]);

  // Add BOM for Excel to recognize UTF-8
  const BOM = '\uFEFF';
  const csvContent = BOM + [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

onMounted(() => {
  transactionStore.fetchAll();
});
</script>
