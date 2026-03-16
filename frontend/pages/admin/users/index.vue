<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all platform users</p>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="exportUsers"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Name or email..."
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              v-model="filters.role"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">User</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Activity</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="px-6 py-12 text-gray-500 dark:text-gray-400">Loading users...</td>
              </tr>
              <tr v-else-if="error" class="text-center">
                <td colspan="5" class="px-6 py-12 text-red-600 dark:text-red-300">{{ error }}</td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0" class="text-center">
                <td colspan="5" class="px-6 py-12 text-gray-500 dark:text-gray-400">No users found</td>
              </tr>
              <tr v-for="user in filteredUsers" :key="user.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-medium text-white">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                      <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  ]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  <span class="text-xs">{{ user._count?.transactions ?? 0 }} tx • {{ user._count?.wallets ?? 0 }} wallets</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      :to="`/admin/users/${user.id}`"
                      class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400"
                      title="View"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-medium">{{ rangeStart }}</span> to <span class="font-medium">{{ rangeEnd }}</span> of <span class="font-medium">{{ pagination.total }}</span> results
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              :disabled="pagination.page <= 1 || loading"
              @click="changePage(pagination.page - 1)"
            >
              Previous
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              :disabled="pagination.page >= pagination.totalPages || loading"
              @click="changePage(pagination.page + 1)"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

type UserOverview = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: {
    transactions: number;
    wallets: number;
  };
};

const filters = ref({
  search: '',
  role: '',
});

const config = useRuntimeConfig();
const token = useCookie('access_token');

const loading = ref(true);
const error = ref('');
const users = ref<UserOverview[]>([]);
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch = !filters.value.search ||
      user.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.value.search.toLowerCase());
    const matchesRole = !filters.value.role || user.role === filters.value.role;
    return matchesSearch && matchesRole;
  });
});

const rangeStart = computed(() => {
  if (pagination.value.total === 0) return 0;
  return (pagination.value.page - 1) * pagination.value.limit + 1;
});

const rangeEnd = computed(() => {
  return Math.min(pagination.value.page * pagination.value.limit, pagination.value.total);
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function exportUsers() {
  const headers = ['id', 'name', 'email', 'role', 'createdAt', 'transactions', 'wallets'];
  const rows = users.value.map((u) => [
    u.id,
    u.name,
    u.email,
    u.role,
    u.createdAt,
    String(u._count?.transactions ?? 0),
    String(u._count?.wallets ?? 0),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users_page_${pagination.value.page}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function fetchUsers(page = 1) {
  loading.value = true;
  error.value = '';
  try {
    const res = await $fetch<{ users: UserOverview[]; pagination: any }>(
      `${config.public.apiBase}/admin/users/overview?page=${page}&limit=${pagination.value.limit}`,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      },
    );
    users.value = res.users ?? [];
    pagination.value = {
      page: res.pagination?.page ?? page,
      limit: res.pagination?.limit ?? pagination.value.limit,
      total: res.pagination?.total ?? 0,
      totalPages: res.pagination?.totalPages ?? 1,
    };
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Failed to load users';
    users.value = [];
    pagination.value.total = 0;
    pagination.value.totalPages = 1;
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  if (page < 1 || page > pagination.value.totalPages) return;
  fetchUsers(page);
}

onMounted(() => {
  fetchUsers(1);
});
</script>
