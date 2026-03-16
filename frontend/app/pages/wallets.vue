<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Wallets</h1>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center gap-2 rounded border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          title="Create Wallet"
          @click="createOpen = true"
        >
          <span class="text-lg leading-none">+</span>
          <span>Create Wallet</span>
        </button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <WalletCard
        v-for="w in walletStore.wallets"
        :key="w.id"
        :wallet="w"
        :actions="{ onEdit: startEdit, onDelete: onDelete }"
      />
      <div v-if="!walletStore.wallets.length" class="text-sm text-gray-500 dark:text-gray-400">No wallets yet.</div>
    </div>

    <ModalForm :open="createOpen" title="Create Wallet" @close="createOpen = false">
      <form class="grid gap-3" @submit.prevent="create">
        <input
          v-model="form.name"
          placeholder="Name"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          required
        />
        <select
          v-model="form.type"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
        >
          <option value="CASH">CASH</option>
          <option value="BANK">BANK</option>
          <option value="EWALLET">EWALLET</option>
          <option value="CARD">CARD</option>
          <option value="OTHER">OTHER</option>
        </select>
        <input
          v-model.number="form.balance"
          type="number"
          placeholder="Balance"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          required
        />
        <button
          type="submit"
          class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          :disabled="loading"
        >
          {{ loading ? 'Creating…' : 'Create' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </ModalForm>

    <ModalForm :open="Boolean(editingId)" title="Edit Wallet" @close="cancelEdit">
      <form class="grid gap-3" @submit.prevent="saveEdit">
        <input v-model="editForm.name" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <select v-model="editForm.type" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="CASH">CASH</option>
          <option value="BANK">BANK</option>
          <option value="EWALLET">EWALLET</option>
          <option value="CARD">CARD</option>
          <option value="OTHER">OTHER</option>
        </select>
        <input v-model.number="editForm.balance" type="number" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <input v-model="editForm.currency" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button
          type="submit"
          class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          :disabled="loading"
        >
          Save
        </button>
      </form>
    </ModalForm>
  </div>
</template>

<script setup lang="ts">
import type { Wallet } from '~/stores/walletStore';

const walletStore = useWalletStore();

useAutoRefreshOnIdle(() => walletStore.fetchAll());

const createOpen = ref(false);

const form = ref({ name: '', type: 'CASH' as Wallet['type'], balance: 0 });
const loading = ref(false);
const error = ref('');

const editingId = ref<string | null>(null);
const editForm = ref({ name: '', type: 'CASH' as Wallet['type'], balance: 0, currency: 'USD' });

async function create() {
  error.value = '';
  loading.value = true;
  try {
    await walletStore.create({ ...form.value });
    form.value.name = '';
    form.value.balance = 0;
    createOpen.value = false;
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

function startEdit(id: string) {
  const w = walletStore.wallets.find((x) => x.id === id);
  if (!w) return;
  editingId.value = id;
  editForm.value = {
    name: w.name,
    type: w.type,
    balance: Number(w.balance),
    currency: w.currency,
  };
}

function cancelEdit() {
  editingId.value = null;
}

async function saveEdit() {
  if (!editingId.value) return;
  loading.value = true;
  try {
    await walletStore.update(editingId.value, {
      name: editForm.value.name,
      type: editForm.value.type,
      balance: editForm.value.balance,
      currency: editForm.value.currency,
    });
    editingId.value = null;
  } finally {
    loading.value = false;
  }
}

async function onDelete(id: string) {
  await walletStore.remove(id);
}

onMounted(() => {
  walletStore.fetchAll();
});
</script>
