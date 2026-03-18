<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Goals</h1>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center gap-2 rounded border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          title="Create Goal"
          @click="createOpen = true"
        >
          <span class="text-lg leading-none">+</span>
          <span>Create Goal</span>
        </button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="g in goalStore.goals" :key="g.id" class="space-y-2">
        <GoalCard :goal="g" @add-money="openTransferModal(g)" />
        <button class="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800" type="button" @click="remove(g.id)">
          Delete
        </button>
      </div>
      <div v-if="!goalStore.goals.length" class="text-sm text-gray-500 dark:text-gray-400">No goals yet.</div>
    </div>

    <!-- Modal Create Goal -->
    <ModalForm :open="createOpen" title="Create Goal" @close="createOpen = false">
      <form class="grid gap-3" @submit.prevent="create">
        <input v-model="form.title" placeholder="Title" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" required />
        <input
          v-model="targetText"
          type="text"
          inputmode="numeric"
          placeholder="Rp. 0"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
          required
          @input="onTargetInput"
        />
        <input v-model="form.deadline" type="date" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </ModalForm>

    <!-- Modal Transfer to Goal -->
    <ModalForm :open="transferOpen" :title="`Add Money to ${transferGoal?.title}`" @close="transferOpen = false">
      <form class="grid gap-3" @submit.prevent="transfer">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">From Wallet</label>
          <select
            v-model="transferForm.walletId"
            class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            required
          >
            <option value="">Select wallet</option>
            <option v-for="w in walletStore.wallets" :key="w.id" :value="w.id">
              {{ w.name }} ({{ formatRupiah(w.balance) }})
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            v-model="transferAmountText"
            type="text"
            inputmode="numeric"
            placeholder="Rp. 0"
            class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            required
            @input="onTransferAmountInput"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            v-model="transferForm.date"
            type="date"
            class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Note (Optional)</label>
          <textarea
            v-model="transferForm.note"
            placeholder="Add a note..."
            class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
            rows="2"
          />
        </div>

        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="transferLoading">
          {{ transferLoading ? 'Transferring...' : 'Transfer' }}
        </button>
      </form>
      <div v-if="transferError" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ transferError }}</div>
    </ModalForm>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/stores/goalStore';

const goalStore = useGoalStore();
const walletStore = useWalletStore();
const goalContributionStore = useGoalContributionStore();

useAutoRefreshOnIdle(() => {
  goalStore.fetchAll();
  walletStore.fetchAll();
});

// Create Goal
const createOpen = ref(false);
const form = ref({ title: '', targetAmount: 0, deadline: '' });
const targetText = ref('');
watch(
  () => form.value.targetAmount,
  (v) => {
    targetText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onTargetInput() {
  form.value.targetAmount = parseRupiah(targetText.value);
}
const loading = ref(false);
const error = ref('');

async function create() {
  error.value = '';
  loading.value = true;
  try {
    await goalStore.create({
      title: form.value.title,
      targetAmount: form.value.targetAmount,
      deadline: form.value.deadline || undefined,
    });
    form.value.title = '';
    form.value.targetAmount = 0;
    form.value.deadline = '';
    createOpen.value = false;
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  await goalStore.remove(id);
}

// Transfer to Goal
const transferOpen = ref(false);
const transferGoal = ref<Goal | null>(null);
const transferForm = ref({
  walletId: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: '',
});
const transferAmountText = ref('');
watch(
  () => transferForm.value.amount,
  (v) => {
    transferAmountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onTransferAmountInput() {
  transferForm.value.amount = parseRupiah(transferAmountText.value);
}

const transferLoading = ref(false);
const transferError = ref('');

function openTransferModal(goal: Goal) {
  transferGoal.value = goal;
  transferForm.value = {
    walletId: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  };
  transferError.value = '';
  transferOpen.value = true;
}

async function transfer() {
  if (!transferGoal.value) return;

  transferError.value = '';
  transferLoading.value = true;
  try {
    await goalContributionStore.create({
      goalId: transferGoal.value.id,
      walletId: transferForm.value.walletId,
      amount: transferForm.value.amount,
      date: transferForm.value.date,
      note: transferForm.value.note || undefined,
    });

    // Refresh goals and wallets to see updated amounts
    await Promise.all([
      goalStore.fetchAll(),
      walletStore.fetchAll(),
    ]);

    transferOpen.value = false;
    transferGoal.value = null;
  } catch (e: any) {
    transferError.value = e?.data?.message ?? e?.message ?? 'Transfer failed';
  } finally {
    transferLoading.value = false;
  }
}

onMounted(() => {
  goalStore.fetchAll();
  walletStore.fetchAll();
});
</script>

