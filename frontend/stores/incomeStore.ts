export type Income = {
  id: string;
  userId: string;
  walletId: string;
  category: string;
  amount: string | number;
  date: string;
  note?: string | null;
};

export const useIncomeStore = defineStore('income', () => {
  const income = ref<Income[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    income.value = await $api<Income[]>('/income');
    return income.value;
  }

  async function create(payload: {
    walletId: string;
    category: string;
    amount: number;
    date: string;
    note?: string;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<Income>('/income', {
      method: 'POST',
      body: payload,
    });
    income.value = [created, ...income.value];
    return created;
  }

  async function update(id: string, payload: Partial<Omit<Income, 'id' | 'userId'>>) {
    const { $api } = useNuxtApp();
    const updated = await $api<Income>(`/income/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    income.value = income.value.map((x) => (x.id === id ? updated : x));
    return updated;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/income/${id}`, { method: 'DELETE' });
    income.value = income.value.filter((x) => x.id !== id);
  }

  return { income, fetchAll, create, update, remove };
});
