<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Activity Logs</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Audit trail of all admin actions</p>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            @click="exportLogs"
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
              placeholder="Search action, target..."
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Action Type</label>
            <select
              v-model="filters.action"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="TOGGLE">Toggle</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Target Type</label>
            <select
              v-model="filters.target"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Targets</option>
              <option value="User">User</option>
              <option value="SupportTicket">Support Ticket</option>
              <option value="FeatureFlag">Feature Flag</option>
              <option value="DefaultCategory">Default Category</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Admin</label>
            <select
              v-model="filters.adminId"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Admins</option>
              <option v-for="admin in admins" :key="admin.id" :value="admin.id">{{ admin.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Timestamp</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Admin</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Action</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Target</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Details</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">IP Address</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="loading" class="text-center">
                <td colspan="6" class="px-6 py-12">
                  <div class="flex items-center justify-center gap-2 text-gray-500">
                    <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading logs...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredLogs.length === 0" class="text-center">
                <td colspan="6" class="px-6 py-12 text-gray-500 dark:text-gray-400">
                  No admin activity logs found
                </td>
              </tr>
              <tr v-for="log in filteredLogs" :key="log.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDateTime(log.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {{ log.admin?.name?.charAt(0) || '?' }}
                    </div>
                    <span class="text-sm text-gray-900 dark:text-white">{{ log.admin?.name || 'Unknown' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getActionClass(log.action)">
                    {{ formatAction(log.action) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <p class="font-medium text-gray-700 dark:text-gray-300">{{ log.target }}</p>
                    <p v-if="log.targetId" class="text-xs text-gray-400 font-mono">{{ log.targetId.slice(0, 8) }}...</p>
                  </div>
                </td>
                <td class="max-w-xs px-6 py-4">
                  <button
                    v-if="log.details"
                    @click="showDetails(log)"
                    class="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    View Details
                  </button>
                  <span v-else class="text-xs text-gray-400">-</span>
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {{ log.ipAddress || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} logs)
          </p>
          <div class="flex gap-2">
            <button
              :disabled="pagination.page <= 1"
              @click="changePage(pagination.page - 1)"
              class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <button
              :disabled="pagination.page >= pagination.totalPages"
              @click="changePage(pagination.page + 1)"
              class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <Teleport to="body">
        <div v-if="selectedLog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="selectedLog = null"></div>
          <div class="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Log Details</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Action</p>
                <p class="text-gray-900 dark:text-white">{{ formatAction(selectedLog.action) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Target</p>
                <p class="text-gray-900 dark:text-white">{{ selectedLog.target }}</p>
              </div>
              <div v-if="selectedLog.targetId">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Target ID</p>
                <p class="font-mono text-sm text-gray-900 dark:text-white">{{ selectedLog.targetId }}</p>
              </div>
              <div v-if="selectedLog.details">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Details</p>
                <pre class="mt-1 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">{{ formatDetails(selectedLog.details) }}</pre>
              </div>
            </div>
            <button
              @click="selectedLog = null"
              class="mt-6 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
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

interface AdminLog {
  id: string
  action: string
  target: string
  targetId?: string
  details?: string
  ipAddress?: string
  createdAt: string
  admin?: {
    id: string
    name: string
    email: string
  }
}

const config = useRuntimeConfig()
const token = useCookie('access_token')

const loading = ref(true)
const logs = ref<AdminLog[]>([])
const admins = ref<any[]>([])
const selectedLog = ref<AdminLog | null>(null)
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1
})

const filters = ref({
  search: '',
  action: '',
  target: '',
  adminId: ''
})

const filteredLogs = computed(() => {
  let result = logs.value
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(l => 
      l.action.toLowerCase().includes(search) ||
      l.target.toLowerCase().includes(search) ||
      l.admin?.name?.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.action) {
    result = result.filter(l => l.action.includes(filters.value.action))
  }
  
  if (filters.value.target) {
    result = result.filter(l => l.target === filters.value.target)
  }
  
  if (filters.value.adminId) {
    result = result.filter(l => l.admin?.id === filters.value.adminId)
  }
  
  return result
})

async function fetchLogs() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    const response = await $fetch<any>(`${config.public.apiBase}/admin/logs?${params}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    logs.value = response.logs
    pagination.value = response.pagination
    
    // Extract unique admins for filter
    const uniqueAdmins = new Map()
    response.logs.forEach((log: AdminLog) => {
      if (log.admin && !uniqueAdmins.has(log.admin.id)) {
        uniqueAdmins.set(log.admin.id, log.admin)
      }
    })
    admins.value = Array.from(uniqueAdmins.values())
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    loading.value = false
  }
}

useAutoRefreshOnIdle(fetchLogs)

function changePage(page: number) {
  pagination.value.page = page
  fetchLogs()
}

function showDetails(log: AdminLog) {
  selectedLog.value = log
}

function getActionClass(action: string) {
  const classes = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium'
  if (action.includes('CREATE')) {
    return `${classes} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
  }
  if (action.includes('UPDATE') || action.includes('TOGGLE')) {
    return `${classes} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`
  }
  if (action.includes('DELETE')) {
    return `${classes} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`
  }
  return `${classes} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400`
}

function formatAction(action: string) {
  return action.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  })
}

function formatDetails(details: string) {
  try {
    return JSON.stringify(JSON.parse(details), null, 2)
  } catch {
    return details
  }
}

function exportLogs() {
  const data = filteredLogs.value.map(log => ({
    timestamp: log.createdAt,
    admin: log.admin?.name || 'Unknown',
    action: log.action,
    target: log.target,
    targetId: log.targetId || '',
    details: log.details || '',
    ipAddress: log.ipAddress || ''
  }))
  
  const csv = [
    ['Timestamp', 'Admin', 'Action', 'Target', 'Target ID', 'Details', 'IP Address'],
    ...data.map(row => Object.values(row))
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  fetchLogs()
})
</script>
