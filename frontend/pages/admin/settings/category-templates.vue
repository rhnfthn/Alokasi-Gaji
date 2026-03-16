<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Category Templates</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Default categories assigned to new users</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Template
        </button>
      </div>

      <!-- Tabs -->
      <div class="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-800">
        <button
          @click="activeTab = 'INCOME'"
          :class="[
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'INCOME'
              ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          Income Categories
        </button>
        <button
          @click="activeTab = 'EXPENSE'"
          :class="[
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'EXPENSE'
              ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          ]"
        >
          Expense Categories
        </button>
      </div>

      <!-- Categories List -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-2 text-gray-500">
          <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading templates...
        </div>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No {{ activeTab.toLowerCase() }} templates</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Add default {{ activeTab.toLowerCase() }} categories for new users.</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Template
        </button>
      </div>

      <div v-else class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <ul class="divide-y divide-gray-100 dark:divide-gray-800">
          <li
            v-for="(category, index) in filteredCategories"
            :key="category.id"
            class="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <!-- Drag Handle -->
            <div class="cursor-move text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            
            <!-- Color & Icon -->
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg text-white"
              :style="{ backgroundColor: category.color || '#6366f1' }"
            >
              <span>{{ category.icon || '📁' }}</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900 dark:text-white">{{ category.name }}</p>
                <span v-if="!category.isActive" class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Inactive
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Sort order: {{ category.sortOrder }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-1">
              <button
                @click="toggleActive(category)"
                :class="[
                  'rounded p-1.5 transition-colors',
                  category.isActive
                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                ]"
                :title="category.isActive ? 'Deactivate' : 'Activate'"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                @click="editCategory(category)"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Edit"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(category)"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Delete"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Common Presets -->
      <div v-if="!loading && filteredCategories.length < 5" class="mt-6">
        <h3 class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Quick Add Presets</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in activeTab === 'INCOME' ? incomePresets : expensePresets"
            :key="preset.name"
            @click="addPreset(preset)"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
          >
            <span>{{ preset.icon }}</span>
            <span class="text-gray-700 dark:text-gray-300">{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <Teleport to="body">
        <div v-if="showCreateModal || editingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>
          <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingCategory ? 'Edit Category Template' : 'Create Category Template' }}
            </h3>
            <form @submit.prevent="saveCategory">
              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Category name"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select
                    v-model="form.type"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                    <input
                      v-model="form.icon"
                      type="text"
                      placeholder="📁"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <input
                      v-model="form.color"
                      type="color"
                      class="h-10 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Sort Order</label>
                  <input
                    v-model.number="form.sortOrder"
                    type="number"
                    min="0"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div class="flex items-center gap-3">
                  <input
                    id="isActive"
                    v-model="form.isActive"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for="isActive" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active (assign to new users)
                  </label>
                </div>
              </div>
              <div class="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="deletingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="deletingCategory = null"></div>
          <div class="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Template</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span class="font-medium text-gray-700 dark:text-gray-300">{{ deletingCategory.name }}</span>?
            </p>
            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                @click="deletingCategory = null"
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                @click="deleteCategory"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['admin']
})

interface DefaultCategory {
  id: string
  name: string
  type: 'INCOME' | 'EXPENSE'
  icon?: string
  color?: string
  isActive: boolean
  sortOrder: number
}

const config = useRuntimeConfig()
const token = useCookie('access_token')

const loading = ref(true)
const saving = ref(false)
const categories = ref<DefaultCategory[]>([])
const activeTab = ref<'INCOME' | 'EXPENSE'>('EXPENSE')
const showCreateModal = ref(false)
const editingCategory = ref<DefaultCategory | null>(null)
const deletingCategory = ref<DefaultCategory | null>(null)

const form = ref({
  name: '',
  type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
  icon: '',
  color: '#6366f1',
  isActive: true,
  sortOrder: 0
})

const incomePresets = [
  { name: 'Salary', icon: '💰', color: '#22c55e' },
  { name: 'Freelance', icon: '💼', color: '#3b82f6' },
  { name: 'Investments', icon: '📈', color: '#8b5cf6' },
  { name: 'Gifts', icon: '🎁', color: '#ec4899' },
  { name: 'Other Income', icon: '💵', color: '#6366f1' },
]

const expensePresets = [
  { name: 'Food & Dining', icon: '🍔', color: '#f97316' },
  { name: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { name: 'Bills & Utilities', icon: '💡', color: '#eab308' },
  { name: 'Healthcare', icon: '🏥', color: '#ef4444' },
  { name: 'Education', icon: '📚', color: '#22c55e' },
  { name: 'Other Expenses', icon: '📦', color: '#6b7280' },
]

const filteredCategories = computed(() => {
  return categories.value
    .filter(c => c.type === activeTab.value)
    .sort((a, b) => a.sortOrder - b.sortOrder)
})

async function fetchCategories() {
  loading.value = true
  try {
    const response = await $fetch<DefaultCategory[]>(`${config.public.apiBase}/admin/default-categories`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    categories.value = response
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

async function toggleActive(category: DefaultCategory) {
  try {
    await $fetch(`${config.public.apiBase}/admin/default-categories/${category.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        isActive: !category.isActive
      }
    })
    category.isActive = !category.isActive
  } catch (error) {
    console.error('Failed to toggle category:', error)
  }
}

function editCategory(category: DefaultCategory) {
  editingCategory.value = category
  form.value = {
    name: category.name,
    type: category.type,
    icon: category.icon || '',
    color: category.color || '#6366f1',
    isActive: category.isActive,
    sortOrder: category.sortOrder
  }
}

function confirmDelete(category: DefaultCategory) {
  deletingCategory.value = category
}

async function addPreset(preset: { name: string; icon: string; color: string }) {
  const maxSort = Math.max(0, ...filteredCategories.value.map(c => c.sortOrder))
  
  try {
    await $fetch(`${config.public.apiBase}/admin/default-categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        name: preset.name,
        type: activeTab.value,
        icon: preset.icon,
        color: preset.color,
        isActive: true,
        sortOrder: maxSort + 1
      }
    })
    await fetchCategories()
  } catch (error) {
    console.error('Failed to add preset:', error)
  }
}

async function saveCategory() {
  saving.value = true
  try {
    if (editingCategory.value) {
      await $fetch(`${config.public.apiBase}/admin/default-categories/${editingCategory.value.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: form.value
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/default-categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: form.value
      })
    }
    closeModal()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to save category:', error)
  } finally {
    saving.value = false
  }
}

async function deleteCategory() {
  if (!deletingCategory.value) return
  
  try {
    await $fetch(`${config.public.apiBase}/admin/default-categories/${deletingCategory.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    deletingCategory.value = null
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete category:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    type: activeTab.value,
    icon: '',
    color: '#6366f1',
    isActive: true,
    sortOrder: 0
  }
}

watch(activeTab, () => {
  form.value.type = activeTab.value
})

onMounted(() => {
  fetchCategories()
})
</script>
