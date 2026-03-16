<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Budgets</h1>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">Create Budget</div>
      <form class="mt-3 grid gap-3 md:grid-cols-5" @submit.prevent="create">
        <select v-model="form.category" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="">Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
        <input
          v-model="amountText"
          type="text"
          inputmode="numeric"
          placeholder="Rp. 0"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          @input="onAmountInput"
        />
        <input v-model.number="form.month" type="number" min="1" max="12" placeholder="Month" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <input v-model.number="form.year" type="number" placeholder="Year" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="b in budgetStore.budgets" :key="b.id" class="space-y-2">
        <BudgetCard :budget="b" />
        <button class="rounded border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800" type="button" @click="remove(b.id)">
          Delete
        </button>
      </div>
      <div v-if="!budgetStore.budgets.length" class="text-sm text-gray-500 dark:text-gray-400">No budgets yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const budgetStore = useBudgetStore();

type Category = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
};

const categories = ref<Category[]>([]);

useAutoRefreshOnIdle(() => budgetStore.fetchAll());

const now = new Date();
const form = ref({ category: '', amount: 0, month: now.getMonth() + 1, year: now.getFullYear() });
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

async function create() {
  error.value = '';
  loading.value = true;
  try {
    await budgetStore.create({ ...form.value });
    form.value.category = '';
    form.value.amount = 0;
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  await budgetStore.remove(id);
}

onMounted(() => {
  const { $api } = useNuxtApp();
  budgetStore.fetchAll();
  $api<Category[]>(`/categories?type=EXPENSE`)
    .then((res) => {
      categories.value = res ?? [];
    })
    .catch(() => {
      categories.value = [];
    });
});
</script>
