export type Goal = {
  id: string;
  userId: string;
  title: string;
  targetAmount: string | number;
  savedAmount: string | number;
  deadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export const useGoalStore = defineStore('goals', () => {
  const goals = ref<Goal[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    goals.value = await $api<Goal[]>('/goals');
    return goals.value;
  }

  async function create(payload: {
    title: string;
    targetAmount: number;
    savedAmount?: number;
    deadline?: string;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<Goal>('/goals', {
      method: 'POST',
      body: payload,
    });
    goals.value = [created, ...goals.value];
    return created;
  }

  async function update(id: string, payload: Partial<Omit<Goal, 'id' | 'userId'>>) {
    const { $api } = useNuxtApp();
    const updated = await $api<Goal>(`/goals/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    goals.value = goals.value.map((g) => (g.id === id ? updated : g));
    return updated;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/goals/${id}`, { method: 'DELETE' });
    goals.value = goals.value.filter((g) => g.id !== id);
  }

  return { goals, fetchAll, create, update, remove };
});

