<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Goals</h1>
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
        <GoalCard :goal="g" />
        <button class="rounded border border-gray-200 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800" type="button" @click="remove(g.id)">
          Delete
        </button>
      </div>
      <div v-if="!goalStore.goals.length" class="text-sm text-gray-500 dark:text-gray-400">No goals yet.</div>
    </div>

    <ModalForm :open="createOpen" title="Create Goal" @close="createOpen = false">
      <form class="grid gap-3" @submit.prevent="create">
        <input v-model="form.title" placeholder="Title" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" required />
        <input
          v-model="targetText"
          type="text"
          inputmode="numeric"
          placeholder="Rp. 0"
          class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950"
          required
          @input="onTargetInput"
        />
        <input v-model="form.deadline" type="date" class="w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-950" />
        <button type="submit" class="rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create' }}
        </button>
      </form>
      <div v-if="error" class="mt-3 text-sm text-red-600 dark:text-red-300">{{ error }}</div>
    </ModalForm>
  </div>
</template>

<script setup lang="ts">
const goalStore = useGoalStore();

useAutoRefreshOnIdle(() => goalStore.fetchAll());

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

onMounted(() => {
  goalStore.fetchAll();
});
</script>


