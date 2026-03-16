export type Transaction = {
  id: string;
  userId: string;
  walletId: string;
  type: 'INCOME' | 'EXPENSE' | 'GOAL_CONTRIBUTION' | 'ADJUSTMENT';
  category?: string | null;
  amount: string | number;
  date: string;
  note?: string | null;
  wallet?: { id: string; name: string; currency: string };
};

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);

  async function fetchAll(params?: { walletId?: string; type?: string }) {
    const { $api } = useNuxtApp();
    transactions.value = await $api<Transaction[]>('/transactions', {
      query: params as any,
    });
    return transactions.value;
  }

  async function getById(id: string) {
    const { $api } = useNuxtApp();
    return $api<Transaction>(`/transactions/${id}`);
  }

  async function exportCsv() {
    const { $api } = useNuxtApp();
    return $api<string>('/transactions/export/csv');
  }

  async function importCsv(csv: string) {
    const { $api } = useNuxtApp();
    return $api<{ success: boolean; created: number }>('/transactions/import/csv', {
      method: 'POST',
      body: { csv },
    });
  }

  return { transactions, fetchAll, getById, exportCsv, importCsv };
});
