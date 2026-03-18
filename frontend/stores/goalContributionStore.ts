export type GoalContribution = {
  id: string;
  userId: string;
  goalId: string;
  walletId: string;
  amount: string | number;
  date: string;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  goal?: {
    id: string;
    title: string;
  };
  wallet?: {
    id: string;
    name: string;
  };
};

export const useGoalContributionStore = defineStore('goalContributions', () => {
  const contributions = ref<GoalContribution[]>([]);

  async function fetchAll() {
    const { $api } = useNuxtApp();
    contributions.value = await $api<GoalContribution[]>('/goal-contributions');
    return contributions.value;
  }

  async function fetchByGoal(goalId: string) {
    const { $api } = useNuxtApp();
    const data = await $api<GoalContribution[]>(`/goal-contributions/goal/${goalId}`);
    return data;
  }

  async function create(payload: {
    goalId: string;
    walletId: string;
    amount: number;
    date: string;
    note?: string;
  }) {
    const { $api } = useNuxtApp();
    const created = await $api<GoalContribution>('/goal-contributions', {
      method: 'POST',
      body: payload,
    });
    contributions.value = [created, ...contributions.value];
    return created;
  }

  async function remove(id: string) {
    const { $api } = useNuxtApp();
    await $api(`/goal-contributions/${id}`, { method: 'DELETE' });
    contributions.value = contributions.value.filter((c) => c.id !== id);
  }

  return { contributions, fetchAll, fetchByGoal, create, remove };
});
