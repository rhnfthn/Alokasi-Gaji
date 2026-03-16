export type Wallet = {
  id: string;
  userId: string;
  name: string;
  type: 'CASH' | 'BANK' | 'EWALLET' | 'CARD' | 'OTHER';
  balance: string | number;
  currency: string;
  createdAt: string;
};

export const useWalletStore = defineStore('wallets', () => {
  const wallets = ref<Wallet[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    wallets.value = await $api<Wallet[]>('/wallets');
    return wallets.value;
  }

  async function create(payload: {
    name: string;
    type: Wallet['type'];
    balance?: number;
    currency?: string;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<Wallet>('/wallets', {
      method: 'POST',
      body: payload,
    });
    wallets.value = [created, ...wallets.value];
    return created;
  }

  async function update(id: string, payload: Partial<Omit<Wallet, 'id' | 'userId' | 'createdAt'>>) {
    const { $api } = useNuxtApp();
    const updated = await $api<Wallet>(`/wallets/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    wallets.value = wallets.value.map((w) => (w.id === id ? updated : w));
    return updated;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/wallets/${id}`, { method: 'DELETE' });
    wallets.value = wallets.value.filter((w) => w.id !== id);
  }

  return { wallets, fetchAll, create, update, remove };
});
