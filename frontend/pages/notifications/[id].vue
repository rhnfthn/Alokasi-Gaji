<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Notification</h1>
      <NuxtLink class="text-sm hover:underline" to="/notifications">Back</NuxtLink>
    </div>

    <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading…</div>

    <div v-else class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="text-base font-semibold">{{ item?.title }}</div>
      <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ item?.createdAt }}</div>
      <div class="mt-4 whitespace-pre-wrap text-sm">{{ item?.body || '-' }}</div>

      <button
        v-if="item && !item.readAt"
        type="button"
        class="mt-4 rounded bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        @click="markRead"
      >
        Mark as read
      </button>
    </div>

    <div v-if="error" class="text-sm text-red-600 dark:text-red-300">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
type Notification = { id: string; title: string; body?: string | null; createdAt: string; readAt?: string | null };

const route = useRoute();

const loading = ref(true);
const error = ref('');
const item = ref<Notification | null>(null);

async function fetchOne() {
  loading.value = true;
  error.value = '';
  try {
    const { $api } = useNuxtApp();
    item.value = await $api<Notification>(`/notifications/${route.params.id}`);
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Load failed';
  } finally {
    loading.value = false;
  }
}

async function markRead() {
  if (!item.value) return;
  try {
    const { $api } = useNuxtApp();
    item.value = await $api<Notification>(`/notifications/${item.value.id}/read`, { method: 'PATCH' });
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Mark read failed';
  }
}

onMounted(() => {
  fetchOne();
});
</script>
