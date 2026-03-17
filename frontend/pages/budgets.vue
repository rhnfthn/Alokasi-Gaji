<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
    </div>

    <!-- Budget Analytics - Month/Year Selector -->
    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Budget vs Actual</h2>
        <div class="flex gap-2">
          <select
            v-model.number="selectedMonth"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            @change="fetchAnalytics"
          >
            <option v-for="m in 12" :key="m" :value="m">{{ getMonthName(m) }}</option>
          </select>
          <select
            v-model.number="selectedYear"
            class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            @change="fetchAnalytics"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Budget Analytics List -->
      <div v-if="analytics" class="space-y-4">
        <div v-if="!analytics.budgets.length && !analytics.unbudgetedExpenses.length" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No budget data for this period
        </div>

        <!-- Budgeted Categories -->
        <div v-for="item in analytics.budgets" :key="item.id" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-gray-900 dark:text-white">{{ item.category }}</span>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 dark:text-gray-400">
                {{ formatRupiah(item.actualAmount) }} / {{ formatRupiah(item.budgetAmount) }}
              </span>
              <span
                class="rounded-full px-2 py-1 text-xs font-semibold"
                :class="{
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': item.status === 'danger',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400': item.status === 'warning',
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400': item.status === 'safe'
                }"
              >
                {{ item.difference >= 0 ? '+' : '' }}{{ formatRupiah(item.difference) }}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-full transition-all duration-500"
              :class="{
                'bg-red-500': item.status === 'danger',
                'bg-yellow-500': item.status === 'warning',
                'bg-green-500': item.status === 'safe'
              }"
              :style="{ width: Math.min(item.percentage, 100) + '%' }"
            ></div>
          </div>

          <!-- Percentage Text -->
          <div class="text-right text-xs font-medium"
            :class="{
              'text-red-600 dark:text-red-400': item.status === 'danger',
              'text-yellow-600 dark:text-yellow-400': item.status === 'warning',
              'text-green-600 dark:text-green-400': item.status === 'safe'
            }"
          >
            {{ item.percentage.toFixed(1) }}% used
          </div>
        </div>

        <!-- Unbudgeted Expenses -->
        <div v-if="analytics.unbudgetedExpenses.length" class="mt-6 space-y-4">
          <h3 class="text-sm font-semibold text-red-600 dark:text-red-400">⚠️ Unbudgeted Expenses</h3>
          <div v-for="item in analytics.unbudgetedExpenses" :key="item.category" class="flex items-center justify-between rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.category }}</span>
            <span class="text-sm font-semibold text-red-600 dark:text-red-400">{{ formatRupiah(item.actualAmount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Budget Form -->
    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Create New Budget</div>
      <form class="grid gap-4 md:grid-cols-5" @submit.prevent="create">
        <select
          v-model="form.category"
          class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        >
          <option value="">Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
        <input
          v-model="amountText"
          type="text"
          inputmode="numeric"
          placeholder="Rp. 0"
          class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
          @input="onAmountInput"
        />
        <input
          v-model.number="form.month"
          type="number"
          min="1"
          max="12"
          placeholder="Month"
          class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
        <input
          v-model.number="form.year"
          type="number"
          placeholder="Year"
          class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          required
        />
        <button
          type="submit"
          class="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'Creating...' : 'Create Budget' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
        {{ error }}
      </div>
    </div>

    <!-- Existing Budgets List -->
    <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">All Budgets</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="b in budgetStore.budgets" :key="b.id" class="space-y-2">
          <BudgetCard :budget="b" />
          <button
            class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
            @click="remove(b.id)"
          >
            Delete
          </button>
        </div>
        <div v-if="!budgetStore.budgets.length" class="col-span-full py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No budgets created yet
        </div>
      </div>
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

type BudgetAnalytics = {
  month: number;
  year: number;
  budgets: {
    id: string;
    category: string;
    budgetAmount: number;
    actualAmount: number;
    difference: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
  }[];
  unbudgetedExpenses: {
    category: string;
    actualAmount: number;
    budgetAmount: number;
    difference: number;
    percentage: number;
    status: 'danger';
  }[];
};

const categories = ref<Category[]>([]);
const analytics = ref<BudgetAnalytics | null>(null);

const now = new Date();
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 1, currentYear, currentYear + 1];
});

function getMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month - 1];
}

async function fetchAnalytics() {
  try {
    const { $api } = useNuxtApp();
    analytics.value = await $api<BudgetAnalytics>('/budgets/analytics', {
      query: {
        month: selectedMonth.value,
        year: selectedYear.value,
      },
    });
  } catch (e) {
    console.error('Failed to fetch analytics:', e);
    analytics.value = null;
  }
}

useAutoRefreshOnIdle(() => {
  budgetStore.fetchAll();
  fetchAnalytics();
});

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
    await fetchAnalytics(); // Refresh analytics after creating budget
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  await budgetStore.remove(id);
  await fetchAnalytics(); // Refresh analytics after deleting budget
}

onMounted(() => {
  const { $api } = useNuxtApp();
  budgetStore.fetchAll();
  fetchAnalytics();

  $api<Category[]>(`/categories?type=EXPENSE`)
    .then((res) => {
      categories.value = res ?? [];
    })
    .catch(() => {
      categories.value = [];
    });
});
</script>
