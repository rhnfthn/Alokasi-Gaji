<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Expenses</h1>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-sm font-semibold">Add Expense</div>
      <form class="mt-3 grid gap-3 md:grid-cols-6" @submit.prevent="create">
        <select v-model="form.walletId" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="">Select wallet</option>
          <option v-for="w in walletStore.wallets" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <input v-model="form.title" placeholder="Name" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <select v-model="form.category" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950">
          <option value="">Select category</option>
          <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
        <input
          v-model="amountText"
          type="text"
          inputmode="numeric"
          placeholder="Rp. 0"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          @input="onAmountInput"
        />
        <input v-model="form.date" type="date" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />

        <input
          ref="receiptInput"
          type="file"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          @change="onReceiptSelected"
        />

        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </form>

      <div v-if="receiptUrl" class="mt-2 text-xs text-gray-500 dark:text-gray-400">Receipt URL: {{ receiptUrl }}</div>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </div>

    <div class="overflow-x-auto rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <tr>
            <th class="px-4 py-2">Date</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Category</th>
            <th class="px-4 py-2">Wallet</th>
            <th class="px-4 py-2 text-right">Amount</th>
            <th class="px-4 py-2">Receipt</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in expenseStore.expenses" :key="e.id" class="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
            <td class="px-4 py-2">{{ formatDate(e.date) }}</td>
            <td class="px-4 py-2">{{ e.title }}</td>
            <td class="px-4 py-2">{{ e.category }}</td>
            <td class="px-4 py-2">{{ walletName(e.walletId) }}</td>
            <td class="px-4 py-2 text-right">{{ formatRupiah(e.amount) }}</td>
            <td class="px-4 py-2">
              <button v-if="e.receiptUrl" type="button" class="text-sm hover:underline" @click="openReceipt(e.receiptUrl)">View</button>
              <span v-else class="text-sm text-gray-500 dark:text-gray-400">-</span>
            </td>
            <td class="px-4 py-2">
              <button class="text-sm hover:underline" type="button" @click="remove(e.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  
    <!-- Modal Receipt Preview -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showReceiptModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
        @click.self="closeReceipt"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showReceiptModal"
            class="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Receipt</h3>
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                @click="closeReceipt"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
              <img
                v-if="receiptPreviewUrl && isImageUrl(receiptPreviewUrl)"
                :src="receiptPreviewUrl"
                alt="Receipt"
                class="mx-auto max-h-[70vh] w-full object-contain"
              />
              <iframe
                v-else-if="receiptPreviewUrl"
                :src="receiptPreviewUrl"
                class="h-[70vh] w-full"
              ></iframe>
              <div v-else class="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No receipt</div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition></div>
</template>

<script setup lang="ts">
const walletStore = useWalletStore();
const expenseStore = useExpenseStore();
const authStore = useAuthStore();

const { formatRupiah, parseRupiah } = useRupiah();

type Category = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
};

const receiptInput = ref<HTMLInputElement | null>(null);

const form = ref({ walletId: '', title: '', category: '', amount: 0, date: new Date().toISOString().slice(0, 10) });

const amountText = ref('');
watch(
  () => form.value.amount,
  (v) => {
    amountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onAmountInput() {
  form.value.amount = parseRupiah(amountText.value);
}
const loading = ref(false);
const error = ref('');
const receiptUrl = ref('');

const categories = ref<Category[]>([]);

const showReceiptModal = ref(false);
const receiptPreviewUrl = ref('');

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url);
}

function resolveReceiptUrl(url: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const base = useRuntimeConfig().public.apiBase;
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}
function openReceipt(url: string) {
  receiptPreviewUrl.value = resolveReceiptUrl(url);
  showReceiptModal.value = true;
}
function closeReceipt() {
  showReceiptModal.value = false;
  receiptPreviewUrl.value = '';
}

function walletName(id: string) {
  return walletStore.wallets.find((w) => w.id === id)?.name ?? id;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

async function refresh() {
  const { $api } = useNuxtApp();
  await Promise.all([
    walletStore.fetchAll(),
    expenseStore.fetchAll(),
    $api<Category[]>(`/categories?type=EXPENSE`).then((res) => {
      categories.value = res ?? [];
    }),
  ]);
}

useAutoRefreshOnIdle(refresh);

async function onReceiptSelected() {
  const file = receiptInput.value?.files?.[0];
  if (!file) return;

  error.value = '';
  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const base = config.public.apiBase;

    const fd = new FormData();
    fd.append('file', file);

    const res = await $fetch<{ success: boolean; url?: string }>(`${base}/upload/receipt`, {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    receiptUrl.value = res.url ?? '';
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Upload failed';
  } finally {
    loading.value = false;
  }
}

async function create() {
  error.value = '';
  loading.value = true;
  try {
    await expenseStore.create({
      walletId: form.value.walletId,
      title: form.value.title,
      category: form.value.category,
      amount: form.value.amount,
      date: form.value.date,
      receiptUrl: receiptUrl.value || undefined,
    });
    form.value.title = '';
    form.value.category = '';
    form.value.amount = 0;
    receiptUrl.value = '';
    if (receiptInput.value) receiptInput.value.value = '';
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  await expenseStore.remove(id);
}

onMounted(() => {
  refresh();
});
</script>

