export type Expense = {
  id: string;
  userId: string;
  walletId: string;
  title: string;
  category: string;
  amount: string | number;
  date: string;
  note?: string | null;
  receiptUrl?: string | null;
};

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    expenses.value = await $api<Expense[]>('/expenses');
    return expenses.value;
  }

  async function create(payload: {
    walletId: string;
    title: string;
    category: string;
    amount: number;
    date: string;
    note?: string;
    receiptUrl?: string;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<Expense>('/expenses', {
      method: 'POST',
      body: payload,
    });
    expenses.value = [created, ...expenses.value];
    return created;
  }

  async function update(id: string, payload: Partial<Omit<Expense, 'id' | 'userId'>>) {
    const { $api } = useNuxtApp();
    const updated = await $api<Expense>(`/expenses/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    expenses.value = expenses.value.map((x) => (x.id === id ? updated : x));
    return updated;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/expenses/${id}`, { method: 'DELETE' });
    expenses.value = expenses.value.filter((x) => x.id !== id);
  }

  return { expenses, fetchAll, create, update, remove };
});
