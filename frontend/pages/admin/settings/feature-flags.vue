<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Feature Flags</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage feature toggles for the platform</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Feature Flag
        </button>
      </div>

      <!-- Feature Flags Grid -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-2 text-gray-500">
          <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading feature flags...
        </div>
      </div>

      <div v-else-if="flags.length === 0" class="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No feature flags</h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new feature flag.</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Feature Flag
        </button>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="flag in flags"
          :key="flag.id"
          class="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ flag.name }}</h3>
                <span :class="[
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  flag.enabled
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                ]">
                  {{ flag.enabled ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
              <p class="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">{{ flag.key }}</p>
              <p v-if="flag.description" class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {{ flag.description }}
              </p>
            </div>
            
            <!-- Toggle Switch -->
            <button
              @click="toggleFlag(flag)"
              :class="[
                'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                flag.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  flag.enabled ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
          
          <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
            <p class="text-xs text-gray-400">
              Created {{ formatDate(flag.createdAt) }}
            </p>
            <div class="flex items-center gap-1">
              <button
                @click="editFlag(flag)"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Edit"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="confirmDelete(flag)"
                class="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Delete"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <Teleport to="body">
        <div v-if="showCreateModal || editingFlag" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>
          <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag' }}
            </h3>
            <form @submit.prevent="saveFlag">
              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Key</label>
                  <input
                    v-model="form.key"
                    type="text"
                    :disabled="!!editingFlag"
                    placeholder="feature_name"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-800"
                    required
                  />
                  <p class="mt-1 text-xs text-gray-500">Use snake_case. Cannot be changed later.</p>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Feature Name"
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="Optional description..."
                    class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>
                <div class="flex items-center gap-3">
                  <input
                    id="enabled"
                    v-model="form.enabled"
                    type="checkbox"
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label for="enabled" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable this feature
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
                  {{ saving ? 'Saving...' : (editingFlag ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Teleport>

      <!-- Delete Confirmation Modal -->
      <Teleport to="body">
        <div v-if="deletingFlag" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="deletingFlag = null"></div>
          <div class="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Feature Flag</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span class="font-medium text-gray-700 dark:text-gray-300">{{ deletingFlag.name }}</span>? This action cannot be undone.
            </p>
            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                @click="deletingFlag = null"
                class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                @click="deleteFlag"
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

interface FeatureFlag {
  id: string
  key: string
  name: string
  description?: string
  enabled: boolean
  createdAt: string
}

const config = useRuntimeConfig()
const token = useCookie('access_token')

const loading = ref(true)
const saving = ref(false)
const flags = ref<FeatureFlag[]>([])
const showCreateModal = ref(false)
const editingFlag = ref<FeatureFlag | null>(null)
const deletingFlag = ref<FeatureFlag | null>(null)

const form = ref({
  key: '',
  name: '',
  description: '',
  enabled: false
})

async function fetchFlags() {
  loading.value = true
  try {
    const response = await $fetch<FeatureFlag[]>(`${config.public.apiBase}/admin/feature-flags`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    flags.value = response
  } catch (error) {
    console.error('Failed to fetch feature flags:', error)
  } finally {
    loading.value = false
  }
}

async function toggleFlag(flag: FeatureFlag) {
  try {
    await $fetch(`${config.public.apiBase}/admin/feature-flags/${flag.id}/toggle`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    flag.enabled = !flag.enabled
  } catch (error) {
    console.error('Failed to toggle flag:', error)
  }
}

function editFlag(flag: FeatureFlag) {
  editingFlag.value = flag
  form.value = {
    key: flag.key,
    name: flag.name,
    description: flag.description || '',
    enabled: flag.enabled
  }
}

function confirmDelete(flag: FeatureFlag) {
  deletingFlag.value = flag
}

async function saveFlag() {
  saving.value = true
  try {
    if (editingFlag.value) {
      await $fetch(`${config.public.apiBase}/admin/feature-flags/${editingFlag.value.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: {
          name: form.value.name,
          description: form.value.description,
          enabled: form.value.enabled
        }
      })
    } else {
      await $fetch(`${config.public.apiBase}/admin/feature-flags`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: form.value
      })
    }
    closeModal()
    await fetchFlags()
  } catch (error: any) {
    console.error('Failed to save flag:', error)
    alert(error.data?.message || 'Failed to save feature flag')
  } finally {
    saving.value = false
  }
}

async function deleteFlag() {
  if (!deletingFlag.value) return
  
  try {
    await $fetch(`${config.public.apiBase}/admin/feature-flags/${deletingFlag.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    deletingFlag.value = null
    await fetchFlags()
  } catch (error) {
    console.error('Failed to delete flag:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  editingFlag.value = null
  form.value = {
    key: '',
    name: '',
    description: '',
    enabled: false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchFlags()
})
</script>
