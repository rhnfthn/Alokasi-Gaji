export type Overview = {
  period: { year: number; month: number };
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  remainingBudget: number;
};

export type CategorySpend = { category: string; amount: number };
export type IncomeExpensePoint = {
  year: number;
  month: number;
  income: number;
  expense: number;
};
export type TrendPoint = { year: number; month: number; expense: number };

export const useAnalyticsStore = defineStore('analytics', () => {
  const overview = ref<Overview | null>(null);
  const spendingByCategory = ref<CategorySpend[]>([]);
  const incomeExpense = ref<IncomeExpensePoint[]>([]);
  const monthlyTrend = ref<TrendPoint[]>([]);

  async function fetchOverview(params?: { year?: number; month?: number }) {
    const { $api } = useNuxtApp();
    overview.value = await $api<Overview>('/analytics/overview', {
      query: params as any,
    });
    return overview.value;
  }

  async function fetchSpendingCategory(params?: { year?: number; month?: number }) {
    const { $api } = useNuxtApp();
    spendingByCategory.value = await $api<CategorySpend[]>(
      '/analytics/spending-category',
      { query: params as any },
    );
    return spendingByCategory.value;
  }

  async function fetchIncomeExpense(monthsBack = 6) {
    const { $api } = useNuxtApp();
    incomeExpense.value = await $api<IncomeExpensePoint[]>(
      '/analytics/income-expense',
      { query: { monthsBack } as any },
    );
    return incomeExpense.value;
  }

  async function fetchMonthlyTrend(monthsBack = 6) {
    const { $api } = useNuxtApp();
    monthlyTrend.value = await $api<TrendPoint[]>('/analytics/monthly-trend', {
      query: { monthsBack } as any,
    });
    return monthlyTrend.value;
  }

  return {
    overview,
    spendingByCategory,
    incomeExpense,
    monthlyTrend,
    fetchOverview,
    fetchSpendingCategory,
    fetchIncomeExpense,
    fetchMonthlyTrend,
  };
});
