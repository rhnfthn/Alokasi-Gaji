<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-2 text-gray-500">
          <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading ticket...
        </div>
      </div>

      <template v-else-if="ticket">
        <!-- Page Header -->
        <div class="mb-6">
          <NuxtLink to="/admin/support" class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tickets
          </NuxtLink>
          
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ ticket.subject }}</h1>
                <span :class="getStatusClass(ticket.status)">{{ formatStatus(ticket.status) }}</span>
              </div>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Opened by {{ ticket.user?.name }} on {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <select
                v-model="ticket.status"
                @change="updateStatus"
                class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select
                v-model="ticket.priority"
                @change="updatePriority"
                class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Original Message -->
            <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div class="mb-4 flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-medium text-white">
                  {{ ticket.user?.name?.charAt(0) || '?' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ ticket.user?.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ ticket.user?.email }}</p>
                </div>
              </div>
              <div class="prose prose-sm max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
                {{ ticket.description }}
              </div>
            </div>

            <!-- Replies -->
            <div v-if="ticket.replies?.length" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Conversation</h3>
              
              <div
                v-for="reply in ticket.replies"
                :key="reply.id"
                :class="[
                  'rounded-xl border p-4',
                  reply.isAdmin
                    ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30'
                    : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                ]"
              >
                <div class="mb-3 flex items-center gap-3">
                  <div :class="[
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white',
                    reply.isAdmin ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  ]">
                    {{ reply.user?.name?.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-gray-900 dark:text-white">{{ reply.user?.name }}</p>
                      <span v-if="reply.isAdmin" class="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
                        Admin
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(reply.createdAt) }}</p>
                  </div>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ reply.message }}</p>
              </div>
            </div>

            <!-- Reply Form -->
            <div v-if="ticket.status !== 'CLOSED'" class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Reply</h3>
              <form @submit.prevent="sendReply">
                <textarea
                  v-model="replyMessage"
                  rows="4"
                  placeholder="Type your reply..."
                  class="mb-4 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                ></textarea>
                <div class="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    @click="replyAndResolve"
                    :disabled="!replyMessage || sending"
                    class="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-900/50"
                  >
                    Reply & Resolve
                  </button>
                  <button
                    type="submit"
                    :disabled="!replyMessage || sending"
                    class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {{ sending ? 'Sending...' : 'Send Reply' }}
                  </button>
                </div>
              </form>
            </div>

            <!-- Closed Notice -->
            <div v-else class="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-800/50">
              <p class="text-gray-500 dark:text-gray-400">This ticket has been closed.</p>
              <button
                @click="reopenTicket"
                class="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Reopen Ticket
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Ticket Info -->
            <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Details</h3>
              <dl class="space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                  <dd class="mt-1">
                    <span :class="getStatusClass(ticket.status)">{{ formatStatus(ticket.status) }}</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</dt>
                  <dd class="mt-1">
                    <span :class="getPriorityClass(ticket.priority)">{{ ticket.priority }}</span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ ticket.assignee?.name || 'Unassigned' }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDateTime(ticket.createdAt) }}
                  </dd>
                </div>
                <div v-if="ticket.resolvedAt">
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</dt>
                  <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDateTime(ticket.resolvedAt) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- User Info -->
            <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Submitter</h3>
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-medium text-white">
                  {{ ticket.user?.name?.charAt(0) || '?' }}
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ ticket.user?.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ ticket.user?.email }}</p>
                </div>
              </div>
              <NuxtLink
                :to="`/admin/users/${ticket.user?.id}`"
                class="mt-4 block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View User Profile
              </NuxtLink>
            </div>
          </div>
        </div>
      </template>

      <!-- Not Found -->
      <div v-else class="py-12 text-center">
        <p class="text-gray-500 dark:text-gray-400">Ticket not found</p>
        <NuxtLink to="/admin/support" class="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Back to Tickets
        </NuxtLink>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['admin']
})

const route = useRoute()
const config = useRuntimeConfig()
const token = useCookie('access_token')

const loading = ref(true)
const sending = ref(false)
const ticket = ref<any>(null)
const replyMessage = ref('')

async function fetchTicket() {
  loading.value = true
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/admin/tickets/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    ticket.value = response
  } catch (error) {
    console.error('Failed to fetch ticket:', error)
  } finally {
    loading.value = false
  }
}

async function updateStatus() {
  try {
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        status: ticket.value.status
      }
    })
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

async function updatePriority() {
  try {
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        priority: ticket.value.priority
      }
    })
  } catch (error) {
    console.error('Failed to update priority:', error)
  }
}

async function sendReply() {
  if (!replyMessage.value) return
  
  sending.value = true
  try {
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        message: replyMessage.value
      }
    })
    replyMessage.value = ''
    await fetchTicket()
  } catch (error) {
    console.error('Failed to send reply:', error)
  } finally {
    sending.value = false
  }
}

async function replyAndResolve() {
  if (!replyMessage.value) return
  
  sending.value = true
  try {
    // Send reply
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}/reply`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        message: replyMessage.value
      }
    })
    
    // Update status to resolved
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        status: 'RESOLVED'
      }
    })
    
    replyMessage.value = ''
    await fetchTicket()
  } catch (error) {
    console.error('Failed to reply and resolve:', error)
  } finally {
    sending.value = false
  }
}

async function reopenTicket() {
  try {
    await $fetch(`${config.public.apiBase}/admin/tickets/${ticket.value.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        status: 'OPEN'
      }
    })
    await fetchTicket()
  } catch (error) {
    console.error('Failed to reopen ticket:', error)
  }
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

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchTicket()
})
</script>
