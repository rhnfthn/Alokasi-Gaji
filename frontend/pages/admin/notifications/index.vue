<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Broadcast notifications to users</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/admin/notifications/send"
            class="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Send New
          </NuxtLink>
        </div>
      </div>

      <!-- Broadcasts Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Recipients</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Created</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="loading" class="text-center">
                <td colspan="4" class="px-6 py-12 text-gray-500 dark:text-gray-400">Loading notifications...</td>
              </tr>
              <tr v-else-if="error" class="text-center">
                <td colspan="4" class="px-6 py-12 text-red-600 dark:text-red-300">{{ error }}</td>
              </tr>
              <tr v-else-if="broadcasts.length === 0" class="text-center">
                <td colspan="4" class="px-6 py-12 text-gray-500 dark:text-gray-400">No broadcasts yet</td>
              </tr>
              <tr
                v-for="b in broadcasts"
                :key="b.id"
                class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="px-6 py-4">
                  <p class="font-medium text-gray-900 dark:text-white">{{ b.title }}</p>
                  <p class="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{{ b.body }}</p>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {{ b.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ b.recipients ?? 0 }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ formatDate(b.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

type Broadcast = {
  id: string;
  title: string;
  body: string;
  type: string;
  audience: string;
  status: string;
  createdAt: string;
  recipients?: number;
};

type ListResponse = {
  broadcasts: Broadcast[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

const { $api } = useNuxtApp();

const loading = ref(true);
const error = ref('');
const broadcasts = ref<Broadcast[]>([]);

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const res = await $api<ListResponse>('/admin/notifications', { query: { page: 1, limit: 50 } });
    broadcasts.value = res?.broadcasts ?? [];
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Load failed';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>