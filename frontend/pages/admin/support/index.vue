<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage user support requests and issues</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <span class="flex h-2 w-2 rounded-full bg-amber-500"></span>
            {{ openTicketsCount }} Open
          </div>
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
              placeholder="Subject or user..."
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="filters.status"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              @change="fetchTickets"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select
              v-model="filters.priority"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</label>
            <select
              v-model="filters.assignee"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All</option>
              <option value="unassigned">Unassigned</option>
              <option value="me">Assigned to Me</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Ticket</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">User</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Priority</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Assignee</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Created</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="loading" class="text-center">
                <td colspan="7" class="px-6 py-12">
                  <div class="flex items-center justify-center gap-2 text-gray-500">
                    <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading tickets...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredTickets.length === 0" class="text-center">
                <td colspan="7" class="px-6 py-12 text-gray-500 dark:text-gray-400">
                  No tickets found
                </td>
              </tr>
              <tr v-for="ticket in filteredTickets" :key="ticket.id" class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="px-6 py-4">
                  <div>
                    <NuxtLink :to="`/admin/support/${ticket.id}`" class="font-medium text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400">
                      {{ ticket.subject }}
                    </NuxtLink>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ ticket._count?.replies || 0 }} replies
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-medium text-white">
                      {{ ticket.user?.name?.charAt(0) || '?' }}
                    </div>
                    <div class="text-sm">
                      <p class="font-medium text-gray-900 dark:text-white">{{ ticket.user?.name }}</p>
                      <p class="text-xs text-gray-500">{{ ticket.user?.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(ticket.status)">
                    {{ formatStatus(ticket.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getPriorityClass(ticket.priority)">
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span v-if="ticket.assignee" class="text-gray-900 dark:text-white">
                    {{ ticket.assignee.name }}
                  </span>
                  <span v-else class="text-gray-400 dark:text-gray-500">Unassigned</span>
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {{ formatDate(ticket.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <NuxtLink
                      :to="`/admin/support/${ticket.id}`"
                      class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                      title="View Details"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </NuxtLink>
                    <button
                      v-if="ticket.status !== 'CLOSED'"
                      @click="quickAssign(ticket)"
                      class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-800 dark:hover:text-green-400"
                      title="Assign to Me"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/50">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Page {{ pagination.page }} of {{ pagination.totalPages }} ({{ pagination.total }} tickets)
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
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['admin']
})

interface User {
  id: string
  name: string
  email: string
}

interface Ticket {
  id: string
  subject: string
  description: string
  status: string
  priority: string
  createdAt: string
  user?: User
  assignee?: User
  _count?: {
    replies: number
  }
}

const config = useRuntimeConfig()
const token = useCookie('access_token')

const loading = ref(true)
const tickets = ref<Ticket[]>([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})

const filters = ref({
  search: '',
  status: '',
  priority: '',
  assignee: ''
})

const openTicketsCount = computed(() => {
  return tickets.value.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length
})

const filteredTickets = computed(() => {
  let result = tickets.value
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(t => 
      t.subject.toLowerCase().includes(search) ||
      t.user?.name?.toLowerCase().includes(search) ||
      t.user?.email?.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.priority) {
    result = result.filter(t => t.priority === filters.value.priority)
  }
  
  if (filters.value.assignee === 'unassigned') {
    result = result.filter(t => !t.assignee)
  }
  
  return result
})

async function fetchTickets() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.status) {
      params.append('status', filters.value.status)
    }
    
    const response = await $fetch<any>(`${config.public.apiBase}/admin/tickets?${params}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    tickets.value = response.tickets
    pagination.value = response.pagination
  } catch (error) {
    console.error('Failed to fetch tickets:', error)
  } finally {
    loading.value = false
  }
}

async function quickAssign(ticket: Ticket) {
  try {
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        status: 'IN_PROGRESS'
      }
    })
    await fetchTickets()
  } catch (error) {
    console.error('Failed to assign ticket:', error)
  }
}

function changePage(page: number) {
  pagination.value.page = page
  fetchTickets()
}

function getStatusClass(status: string) {
  const classes = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium'
  switch (status) {
    case 'OPEN':
      return `${classes} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`
    case 'IN_PROGRESS':
      return `${classes} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`
    case 'RESOLVED':
      return `${classes} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
    case 'CLOSED':
      return `${classes} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`
    default:
      return `${classes} bg-gray-100 text-gray-700`
  }
}

function getPriorityClass(priority: string) {
  const classes = 'inline-flex rounded-full px-2.5 py-1 text-xs font-medium'
  switch (priority) {
    case 'URGENT':
      return `${classes} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`
    case 'HIGH':
      return `${classes} bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`
    case 'MEDIUM':
      return `${classes} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`
    case 'LOW':
      return `${classes} bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400`
    default:
      return `${classes} bg-gray-100 text-gray-700`
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchTickets()
})
</script>
