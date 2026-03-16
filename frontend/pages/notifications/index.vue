<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Notifications</h1>
    </div>

    <div class="overflow-x-auto rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <tr>
            <th class="px-4 py-2">Title</th>
            <th class="px-4 py-2">Read</th>
            <th class="px-4 py-2">Created</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in items" :key="n.id" class="border-b border-gray-100 last:border-b-0 dark:border-gray-800">
            <td class="px-4 py-2">{{ n.title }}</td>
            <td class="px-4 py-2">{{ n.readAt ? 'Yes' : 'No' }}</td>
            <td class="px-4 py-2">{{ formatDate(n.createdAt) }}</td>
            <td class="px-4 py-2">
              <NuxtLink class="text-sm hover:underline" :to="`/notifications/${n.id}`">Open</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="error" class="text-sm text-red-600 dark:text-red-300">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
type Notification = { id: string; title: string; body?: string | null; createdAt: string; readAt?: string | null };

const items = ref<Notification[]>([]);
const error = ref('');

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function fetchAll() {
  error.value = '';
  try {
    const { $api } = useNuxtApp();
    items.value = await $api<Notification[]>('/notifications');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Load failed';
  }
}

useAutoRefreshOnIdle(fetchAll);

onMounted(() => {
  fetchAll();
});
</script>
