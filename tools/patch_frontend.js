const fs = require('fs');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function write(p, c) {
  fs.writeFileSync(p, c, 'utf8');
}

function patchFile(p, transform) {
  if (!fs.existsSync(p)) return;
  const before = read(p);
  const after = transform(before);
  if (after !== before) write(p, after);
}

function fixLiteralBackslashN(c) {
  return c.replace(/\\n/g, '\n');
}

function ensureHelperAfter(c, anchor, helperBlock) {
  if (!c.includes(anchor)) return c;
  const marker = helperBlock.trim().split('\n')[0];
  if (c.includes(marker)) return c;
  return c.replace(anchor, anchor + '\n\n' + helperBlock.trimEnd() + '\n');
}

function patchSavingLabel(c) {
  return c
    .replace(
      /\{\{\s*loading\s*\?\s*'Saving[^']*'\s*:\s*'Save Expense'\s*\}\}/g,
      "{{ loading ? 'Saving...' : 'Save Expense' }}",
    )
    .replace(
      /\{\{\s*loading\s*\?\s*'Saving[^']*'\s*:\s*'Save'\s*\}\}/g,
      "{{ loading ? 'Saving...' : 'Save' }}",
    );
}

function patchReceiptUploaded(c) {
  return c.replace(
    /<p v-if="receiptUrl"([^>]*)>[\s\S]*?Receipt uploaded<\/p>/g,
    '<p v-if="receiptUrl"$1>Receipt uploaded</p>',
  );
}

function patchExpensesFancy(c) {
  c = fixLiteralBackslashN(c);
  c = patchSavingLabel(c);
  c = patchReceiptUploaded(c);

  c = c.replace(
    '<td class="px-4 py-2 text-right">{{ e.amount }}</td>',
    '<td class="px-4 py-2 text-right">{{ formatRupiah(e.amount) }}</td>',
  );

  // amount input
  c = c.replace(
    /<input\s*\r?\n\s*v-model\.number="form\.amount"\s*\r?\n\s*type="number"\s*\r?\n\s*placeholder="0"\s*\r?\n\s*class="([^"]+)"\s*\r?\n\s*required\s*\r?\n\s*\/>/m,
    (m, cls) => {
      const lines = [
        '<input',
        '                  v-model="amountText"',
        '                  type="text"',
        '                  inputmode="numeric"',
        '                  placeholder="Rp. 0"',
        `                  class="${cls}"`,
        '                  required',
        '                  @input="onAmountInput"',
        '                />',
      ];
      return lines.join('\n');
    },
  );

  const anchor = "const form = ref({ walletId: '', title: '', category: '', amount: 0, date: new Date().toISOString().slice(0, 10) });";
  const helper = `const amountText = ref('');
watch(
  () => form.value.amount,
  (v) => {
    amountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onAmountInput() {
  form.value.amount = parseRupiah(amountText.value);
}`;

  c = ensureHelperAfter(c, anchor, helper);
  return c;
}

function patchExpensesApp(c) {
  c = fixLiteralBackslashN(c);
  c = patchSavingLabel(c);

  c = c.replace(
    '<td class="px-4 py-2 text-right">{{ e.amount }}</td>',
    '<td class="px-4 py-2 text-right">{{ formatRupiah(e.amount) }}</td>',
  );

  c = c.replace(
    /<input v-model\.number="form\.amount" type="number" placeholder="Amount" class="([^"]+)" \/>/,
    (m, cls) =>
      [
        '<input',
        '          v-model="amountText"',
        '          type="text"',
        '          inputmode="numeric"',
        '          placeholder="Rp. 0"',
        `          class="${cls}"`,
        '          @input="onAmountInput"',
        '        />',
      ].join('\n'),
  );

  c = c.replace(
    /<div v-if="receiptUrl" class="mt-2 text-xs text-gray-500 dark:text-gray-400">Receipt URL: \{\{ receiptUrl \}\}<\/div>/,
    '<p v-if="receiptUrl" class="mt-2 text-xs text-green-600 dark:text-green-400">Receipt uploaded</p>',
  );

  const anchor = "const form = ref({ walletId: '', title: '', category: '', amount: 0, date: new Date().toISOString().slice(0, 10) });";
  const helper = `const amountText = ref('');
watch(
  () => form.value.amount,
  (v) => {
    amountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onAmountInput() {
  form.value.amount = parseRupiah(amountText.value);
}`;

  c = ensureHelperAfter(c, anchor, helper);
  return c;
}

function transactionsIndexContent() {
  return `<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold">Transactions</h1>

      <div class="flex flex-wrap items-center gap-2">
        <div class="inline-flex overflow-hidden rounded border border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="px-3 py-2 text-sm"
            :class="groupBy === 'day' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'"
            @click="groupBy = 'day'"
          >
            By Day
          </button>
          <button
            type="button"
            class="px-3 py-2 text-sm"
            :class="groupBy === 'month' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'"
            @click="groupBy = 'month'"
          >
            By Month
          </button>
        </div>

        <button
          type="button"
          class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          @click="exportExcel"
        >
          Export Excel
        </button>
      </div>
    </div>

    <div v-for="g in grouped" :key="g.key" class="space-y-2">
      <div
        class="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="font-semibold">{{ g.label }}</div>
        <div class="text-gray-600 dark:text-gray-300">
          <span class="mr-3">In: {{ formatRupiah(g.income) }}</span>
          <span class="mr-3">Out: {{ formatRupiah(g.expense) }}</span>
          <span>Net: {{ formatRupiah(g.income - g.expense) }}</span>
        </div>
      </div>
      <TransactionTable :items="g.items" :hide-header="true" />
    </div>

    <div v-if="!transactionStore.transactions.length" class="text-sm text-gray-500 dark:text-gray-400">No transactions yet.</div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';

const transactionStore = useTransactionStore();

useAutoRefreshOnIdle(() => transactionStore.fetchAll());

const groupBy = ref<'day' | 'month'>('month');

function toDateKey(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');F
  return `${y}-${m}-${day}`;
}

function toMonthKey(date: string) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

const grouped = computed(() => {
  const map = new Map<string, { key: string; label: string; items: any[]; income: number; expense: number }>();

  for (const t of transactionStore.transactions) {
    const key = groupBy.value === 'day' ? toDateKey(t.date) : toMonthKey(t.date);
    if (!map.has(key)) map.set(key, { key, label: key, items: [], income: 0, expense: 0 });
    const g = map.get(key)!;
    g.items.push(t);

    const amt = Number(t.amount ?? 0);
    if (t.type === 'INCOME') g.income += amt;
    else if (t.type === 'EXPENSE') g.expense += amt;
  }

  const arr = Array.from(map.values());
  arr.sort((a, b) => (a.key < b.key ? 1 : -1));
  return arr;
});

function exportExcel() {
  const rows = transactionStore.transactions.map((t) => ({
    Date: toDateKey(t.date),
    Type: t.type,
    Category: t.category ?? '',
    Wallet: t.wallet?.name ?? t.walletId,
    Amount: Number(t.amount ?? 0),
    Note: t.note ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

onMounted(() => {
  transactionStore.fetchAll();
});
</script>
`;
}

patchFile('frontend/pages/expenses.vue', patchExpensesFancy);
patchFile('frontend/app/pages/expenses.vue', patchExpensesApp);

write('frontend/pages/transactions/index.vue', transactionsIndexContent());
write('frontend/app/pages/transactions/index.vue', transactionsIndexContent());

console.log('Patched expenses + transactions.');
