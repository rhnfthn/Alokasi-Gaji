<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Breadcrumb -->
      <nav class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink to="/admin/categories" class="hover:text-indigo-600 dark:hover:text-indigo-400">Categories</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white">Add New</span>
      </nav>

      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Category</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new transaction category</p>
      </div>

      <!-- Form -->
      <div class="mx-auto max-w-2xl">
        <form class="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900" @submit.prevent="saveCategory">
          <!-- Category Name -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., Food & Dining"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Description -->
          <!-- Type -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <div class="flex gap-4">
              <label class="flex cursor-pointer items-center gap-2">
                <input
                  v-model="form.type"
                  type="radio"
                  value="INCOME"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Income</span>
              </label>
              <label class="flex cursor-pointer items-center gap-2">
                <input
                  v-model="form.type"
                  type="radio"
                  value="EXPENSE"
                  class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Expense</span>
              </label>
            </div>
          </div>

          <!-- Sort Order -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Sort Order</label>
            <input
              v-model.number="form.sortOrder"
              type="number"
              min="0"
              class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Active -->
          <div class="flex items-center gap-3">
            <input
              id="isActive"
              v-model="form.isActive"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label for="isActive" class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <!-- Icon -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon (Emoji)</label>
            <div class="flex gap-3">
              <input
                v-model="form.icon"
                type="text"
                maxlength="2"
                placeholder="🏷️"
                class="w-20 rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-xl focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
              />
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="emoji in suggestedEmojis"
                  :key="emoji"
                  type="button"
                  class="rounded-lg border border-gray-200 px-3 py-2 text-lg transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                  @click="form.icon = emoji"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>

          <!-- Color -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <div class="flex items-center gap-3">
              <input
                v-model="form.color"
                type="color"
                class="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <input
                v-model="form.color"
                type="text"
                maxlength="7"
                placeholder="#6366f1"
                class="w-32 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <div class="flex gap-2">
                <button
                  v-for="color in suggestedColors"
                  :key="color"
                  type="button"
                  class="h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110"
                  :class="form.color === color ? 'border-indigo-500' : 'border-transparent'"
                  :style="{ backgroundColor: color }"
                  @click="form.color = color"
                ></button>
              </div>
            </div>
          </div>

          <!-- Preview -->
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p class="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Preview</p>
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                :style="{ backgroundColor: form.color + '20' }"
              >
                {{ form.icon || '🏷️' }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ form.name || 'Category Name' }}</p>
                <span
                  :class="[
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    form.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  ]"
                >
                  {{ form.type }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
            <NuxtLink
              to="/admin/categories"
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="loading"
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {{ loading ? 'Creating…' : 'Create Category' }}
            </button>
          </div>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

const { $api } = useNuxtApp();

const loading = ref(false);
const error = ref('');

const form = ref({
  name: '',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  icon: '',
  color: '#6366f1',
  isActive: true,
  sortOrder: 0,
});

const suggestedEmojis = ['💰', '🛒', '🚗', '💡', '🏥', '🎮', '📚', '🏠', '✈️', '🍔', '👕', '💼'];
const suggestedColors = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#ef4444', '#84cc16'];

async function saveCategory() {
  loading.value = true;
  error.value = '';
  try {
    await $api('/admin/default-categories', {
      method: 'POST',
      body: {
        name: form.value.name,
        type: form.value.type,
        icon: form.value.icon || undefined,
        color: form.value.color || undefined,
        isActive: form.value.isActive,
        sortOrder: form.value.sortOrder,
      },
    });
    navigateTo('/admin/categories');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Create failed';
  } finally {
    loading.value = false;
  }
}
</script>
