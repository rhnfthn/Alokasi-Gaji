<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Income</h1>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">Add Income</div>
      <form class="mt-3 grid gap-3 md:grid-cols-5" @submit.prevent="create">
        <select v-model="form.walletId" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="">Select wallet</option>
          <option v-for="w in walletStore.wallets" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <select v-model="form.category" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="">Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
        <input v-model="amountText" type="text" inputmode="numeric" placeholder="Rp. 0" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" @input="onAmountInput" />
        <input v-model="form.date" type="date" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Savingâ€¦' : 'Save' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="overflow-x-auto rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <tr>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Category</th>
            <th class="px-4 py-2">Wallet</th>
            <th class="px-4 py-2 text-right">Amount</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in incomeStore.income" :key="i.id" class="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
            <td class="px-4 py-2">{{ formatDate(i.date) }}</td>
            <td class="px-4 py-2">{{ i.category }}</td>
            <td class="px-4 py-2">{{ walletName(i.walletId) }}</td>
            <td class="px-4 py-2 text-right">{{ formatRupiah(i.amount) }}</td>
            <td class="px-4 py-2">
              <button class="text-sm hover:underline" type="button" @click="remove(i.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const walletStore = useWalletStore();
const incomeStore = useIncomeStore();

type Category = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
};

const form = ref({ walletId: '', category: '', amount: 0, date: new Date().toISOString().slice(0, 10) });
const amountText = ref('');
watch(
  () => form.value.amount,
  (v) => {
    amountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onAmountInput() {
  form.value.amount = parseRupiah(amountText.value);
}
const loading = ref(false);
const error = ref('');

const categories = ref<Category[]>([]);

function walletName(id: string) {
  return walletStore.wallets.find((w) => w.id === id)?.name ?? id;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

async function refresh() {
  const { $api } = useNuxtApp();
  await Promise.all([
    walletStore.fetchAll(),
    incomeStore.fetchAll(),
    $api<Category[]>(`/categories?type=INCOME`).then((res) => {
      categories.value = res ?? [];
    }),
  ]);
}

useAutoRefreshOnIdle(refresh);

async function create() {
  error.value = '';
  loading.value = true;
  try {
    await incomeStore.create({
      walletId: form.value.walletId,
      category: form.value.category,
      amount: form.value.amount,
      date: form.value.date,
    });
    form.value.category = '';
    form.value.amount = 0;
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  await incomeStore.remove(id);
}

onMounted(() => {
  refresh();
});
</script>

