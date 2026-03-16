<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Category Management</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage transaction categories</p>
        </div>
        <NuxtLink
          to="/admin/categories/add"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </NuxtLink>
      </div>

      <!-- Category Tabs -->
      <div class="mb-6">
        <nav class="flex gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Categories Grid -->
      <div v-if="loading" class="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>

      <div v-else-if="error" class="py-12 text-center text-sm text-red-600 dark:text-red-400">{{ error }}</div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="cat in filteredCategories"
          :key="cat.id"
          class="group rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="mb-4 flex items-center justify-between">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              :style="{ backgroundColor: (cat.color || '#6366f1') + '20' }"
            >
              {{ cat.icon || '🏷️' }}
            </div>
            <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <NuxtLink
                :to="`/admin/categories/${cat.id}/edit`"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                @click="deleteCategory(cat.id)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <h3 class="mb-1 font-semibold text-gray-900 dark:text-white">{{ cat.name }}</h3>
          <div class="flex items-center justify-between">
            <span
              :class="[
                'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                cat.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              ]"
            >
              {{ cat.type }}
            </span>
            <span
              :class="[
                'text-xs font-medium',
                cat.isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              ]"
            >
              {{ cat.isActive ? 'Active' : 'Inactive' }} · Sort {{ cat.sortOrder }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && filteredCategories.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No categories</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new category.</p>
        <div class="mt-6">
          <NuxtLink
            to="/admin/categories/add"
            class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </NuxtLink>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

type DefaultCategory = {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  icon?: string | null;
  color?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const { $api } = useNuxtApp();

const loading = ref(false);
const error = ref('');

const activeTab = ref<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

const tabs = [
  { label: 'All', value: 'ALL' },
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
];

const categories = ref<DefaultCategory[]>([]);

const filteredCategories = computed(() => {
  if (activeTab.value === 'ALL') return categories.value;
  return categories.value.filter((cat) => cat.type === activeTab.value);
});

async function fetchCategories() {
  loading.value = true;
  error.value = '';
  try {
    categories.value = await $api<DefaultCategory[]>('/admin/default-categories');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Failed to load categories';
    categories.value = [];
  } finally {
    loading.value = false;
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    await $api(`/admin/default-categories/${id}`, { method: 'DELETE' });
    categories.value = categories.value.filter((c) => c.id !== id);
  } catch (e: any) {
    alert(e?.data?.message ?? e?.message ?? 'Delete failed');
  }
}

onMounted(() => {
  fetchCategories();
});
</script>
