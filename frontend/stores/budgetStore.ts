export type Budget = {
  id: string;
  userId: string;
  category: string;
  amount: string | number;
  month: number;
  year: number;
};

export const useBudgetStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    budgets.value = await $api<Budget[]>('/budgets');
    return budgets.value;
  }

  async function create(payload: {
    category: string;
    amount: number;
    month: number;
    year: number;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<Budget>('/budgets', {
      method: 'POST',
      body: payload,
    });
    budgets.value = [created, ...budgets.value];
    return created;
  }

  async function update(id: string, payload: Partial<Omit<Budget, 'id' | 'userId'>>) {
    const { $api } = useNuxtApp();
    const updated = await $api<Budget>(`/budgets/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    budgets.value = budgets.value.map((b) => (b.id === id ? updated : b));
    return updated;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/budgets/${id}`, { method: 'DELETE' });
    budgets.value = budgets.value.filter((b) => b.id !== id);
  }

  return { budgets, fetchAll, create, update, remove };
});
