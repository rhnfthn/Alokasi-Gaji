<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get help with your account or report an issue
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50"
          @click="showCreateModal = true"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>
    </div>

    <!-- Quick Help Cards -->
    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Documentation</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse guides and tutorials</p>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">FAQ</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Frequently asked questions</p>
      </div>
      <NuxtLink to="/support/chat" class="block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Chat with our support team</p>
      </NuxtLink>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-900 dark:text-white">Contact Us</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">support@finflow.app</p>
      </div>
    </div>

    <!-- My Tickets Section -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">My Support Tickets</h2>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {{ pagination.total }} tickets
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="flex flex-col items-center justify-center py-12">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
          <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 class="mb-1 font-medium text-gray-900 dark:text-white">No tickets yet</h3>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">Create your first support ticket</p>
        <button
          type="button"
          class="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          @click="showCreateModal = true"
        >
          Create Ticket
        </button>
      </div>

      <!-- Tickets List -->
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
        <NuxtLink
          v-for="ticket in tickets"
          :key="ticket.id"
          :to="`/support/${ticket.id}`"
          class="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <div :class="['flex h-10 w-10 items-center justify-center rounded-xl', getStatusBgColor(ticket.status)]">
            <svg class="h-5 w-5" :class="getStatusTextColor(ticket.status)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ ticket.subject }}</p>
              <span :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold', getStatusBadgeColor(ticket.status)]">
                {{ formatStatus(ticket.status) }}
              </span>
              <span :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold', getPriorityBadgeColor(ticket.priority)]">
                {{ ticket.priority }}
              </span>
            </div>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">{{ ticket.message }}</p>
          </div>
          <div class="hidden text-right sm:block">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(ticket.createdAt) }}</p>
            <p v-if="ticket._count?.replies" class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
              {{ ticket._count.replies }} replies
            </p>
          </div>
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Page {{ pagination.page }} of {{ pagination.totalPages }}
        </p>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="pagination.page <= 1"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800"
            @click="fetchTickets(pagination.page - 1)"
          >
            Previous
          </button>
          <button
            type="button"
            :disabled="pagination.page >= pagination.totalPages"
            class="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="fetchTickets(pagination.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" @click.self="showCreateModal = false">
          <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Create Support Ticket</h3>
              <button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="showCreateModal = false">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="submitTicket">
              <div class="space-y-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input
                    v-model="newTicket.subject"
                    type="text"
                    required
                    placeholder="Brief description of your issue"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <select
                    v-model="newTicket.priority"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-emerald-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    v-model="newTicket.message"
                    required
                    rows="5"
                    placeholder="Describe your issue in detail..."
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-emerald-500"
                  />
                </div>
              </div>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  class="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  @click="showCreateModal = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 disabled:opacity-50"
                >
                  <span v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {{ submitting ? 'Submitting...' : 'Submit Ticket' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  _count?: { replies: number };
}

const config = useRuntimeConfig();
const token = useCookie('access_token');

const loading = ref(true);
const submitting = ref(false);
const showCreateModal = ref(false);
const tickets = ref<Ticket[]>([]);
const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 });

const newTicket = ref({
  subject: '',
  message: '',
  priority: 'MEDIUM',
});

async function fetchTickets(page = 1) {
  loading.value = true;
  try {
    const res = await $fetch<any>(`${config.public.apiBase}/support/tickets?page=${page}&limit=10`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    tickets.value = res.tickets || [];
    pagination.value = res.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
  } catch (err) {
    console.error('Failed to fetch tickets:', err);
  } finally {
    loading.value = false;
  }
}

async function submitTicket() {
  submitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/support/tickets`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: newTicket.value,
    });
    showCreateModal.value = false;
    newTicket.value = { subject: '', message: '', priority: 'MEDIUM' };
    await fetchTickets();
  } catch (err) {
    console.error('Failed to submit ticket:', err);
    alert('Failed to submit ticket. Please try again.');
  } finally {
    submitting.value = false;
  }
}

function formatStatus(status: string) {
  return status.replace('_', ' ');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBgColor(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-amber-100 dark:bg-amber-900/30';
    case 'IN_PROGRESS': return 'bg-blue-100 dark:bg-blue-900/30';
    case 'RESOLVED': return 'bg-green-100 dark:bg-green-900/30';
    case 'CLOSED': return 'bg-gray-100 dark:bg-gray-800';
    default: return 'bg-gray-100 dark:bg-gray-800';
  }
}

function getStatusTextColor(status: string) {
  switch (status) {
    case 'OPEN': return 'text-amber-600 dark:text-amber-400';
    case 'IN_PROGRESS': return 'text-blue-600 dark:text-blue-400';
    case 'RESOLVED': return 'text-green-600 dark:text-green-400';
    case 'CLOSED': return 'text-gray-500 dark:text-gray-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'OPEN': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'RESOLVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'CLOSED': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}

function getPriorityBadgeColor(priority: string) {
  switch (priority) {
    case 'LOW': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    case 'MEDIUM': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'HIGH': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'URGENT': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}

onMounted(() => fetchTickets());
</script>
