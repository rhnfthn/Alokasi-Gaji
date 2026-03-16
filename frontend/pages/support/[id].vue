<template>
  <div>
    <!-- Back Button -->
    <div class="mb-6">
      <NuxtLink
        to="/support"
        class="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Support
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>

    <!-- Error State -->
    <div v-else-if="!ticket" class="flex flex-col items-center justify-center py-20">
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
        <svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 class="mb-1 font-medium text-gray-900 dark:text-white">Ticket Not Found</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">This ticket doesn't exist or you don't have access to it.</p>
    </div>

    <!-- Ticket Content -->
    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Ticket Header -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div class="flex-1">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ ticket.subject }}</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ticket #{{ ticket.id.slice(0, 8) }} • Opened {{ formatDate(ticket.createdAt) }}
              </p>
            </div>
            <div class="flex gap-2">
              <span :class="['rounded-full px-3 py-1 text-xs font-semibold', getStatusBadgeColor(ticket.status)]">
                {{ formatStatus(ticket.status) }}
              </span>
              <span :class="['rounded-full px-3 py-1 text-xs font-semibold', getPriorityBadgeColor(ticket.priority)]">
                {{ ticket.priority }}
              </span>
            </div>
          </div>
          <div class="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ ticket.message }}</p>
          </div>
        </div>

        <!-- Replies -->
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h2 class="font-semibold text-gray-900 dark:text-white">
              Conversation ({{ ticket.replies?.length || 0 }} replies)
            </h2>
          </div>

          <!-- No Replies -->
          <div v-if="!ticket.replies?.length" class="flex flex-col items-center justify-center py-12">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">No replies yet. Our team will respond soon.</p>
          </div>

          <!-- Replies List -->
          <div v-else class="divide-y divide-gray-200 dark:divide-gray-800">
            <div
              v-for="reply in ticket.replies"
              :key="reply.id"
              class="p-6"
              :class="reply.isAdmin ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''"
            >
              <div class="mb-3 flex items-start justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div :class="['flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white', reply.isAdmin ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600']">
                    {{ reply.user?.name?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-gray-900 dark:text-white">{{ reply.user?.name }}</p>
                      <span v-if="reply.isAdmin" class="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        Support Team
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(reply.createdAt) }}</p>
                  </div>
                </div>
              </div>
              <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ reply.message }}</p>
            </div>
          </div>

          <!-- Reply Form -->
          <div v-if="ticket.status !== 'CLOSED'" class="border-t border-gray-200 p-6 dark:border-gray-800">
            <form @submit.prevent="submitReply">
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Add Reply</label>
              <textarea
                v-model="replyMessage"
                required
                rows="3"
                placeholder="Type your message here..."
                class="mb-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-500"
              />
              <button
                type="submit"
                :disabled="submitting || !replyMessage.trim()"
                class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 disabled:opacity-50"
              >
                <span v-if="submitting" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {{ submitting ? 'Sending...' : 'Send Reply' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Ticket Info -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Ticket Information</h3>
          <dl class="space-y-4">
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="mt-1">
                <span :class="['rounded-full px-3 py-1 text-xs font-semibold', getStatusBadgeColor(ticket.status)]">
                  {{ formatStatus(ticket.status) }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Priority</dt>
              <dd class="mt-1">
                <span :class="['rounded-full px-3 py-1 text-xs font-semibold', getPriorityBadgeColor(ticket.priority)]">
                  {{ ticket.priority }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Created</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300">{{ formatDateTime(ticket.createdAt) }}</dd>
            </div>
            <div v-if="ticket.updatedAt !== ticket.createdAt">
              <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300">{{ formatDateTime(ticket.updatedAt) }}</dd>
            </div>
            <div v-if="ticket.assignee">
              <dt class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Assigned To</dt>
              <dd class="mt-1 text-sm text-gray-700 dark:text-gray-300">{{ ticket.assignee.name }}</dd>
            </div>
          </dl>
        </div>

        <!-- Actions -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Actions</h3>
          <div class="space-y-3">
            <button
              v-if="ticket.status !== 'CLOSED'"
              type="button"
              :disabled="closing"
              class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="closeTicket"
            >
              {{ closing ? 'Closing...' : 'Close Ticket' }}
            </button>
            <p v-else class="text-center text-sm text-gray-500 dark:text-gray-400">
              This ticket is closed. Reply to reopen it.
            </p>
          </div>
        </div>

        <!-- Need More Help -->
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
          <h3 class="mb-2 font-semibold text-emerald-900 dark:text-emerald-100">Need urgent help?</h3>
          <p class="mb-4 text-sm text-emerald-700 dark:text-emerald-300">
            For urgent matters, contact us directly via email.
          </p>
          <a
            href="mailto:support@finflow.app"
            class="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@finflow.app
          </a>
        </div>
      </div>
    </div>
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
  updatedAt: string;
  user?: { id: string; name: string; email: string };
  assignee?: { id: string; name: string };
  replies?: Array<{
    id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string;
    user?: { id: string; name: string; role: string };
  }>;
}

const route = useRoute();
const config = useRuntimeConfig();
const token = useCookie('access_token');

const loading = ref(true);
const submitting = ref(false);
const closing = ref(false);
const ticket = ref<Ticket | null>(null);
const replyMessage = ref('');

async function fetchTicket() {
  loading.value = true;
  try {
    const res = await $fetch<Ticket>(`${config.public.apiBase}/support/tickets/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    ticket.value = res;
  } catch (err) {
    console.error('Failed to fetch ticket:', err);
    ticket.value = null;
  } finally {
    loading.value = false;
  }
}

async function submitReply() {
  if (!replyMessage.value.trim()) return;
  submitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/support/tickets/${route.params.id}/reply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { message: replyMessage.value },
    });
    replyMessage.value = '';
    await fetchTicket();
  } catch (err) {
    console.error('Failed to send reply:', err);
    alert('Failed to send reply. Please try again.');
  } finally {
    submitting.value = false;
  }
}

async function closeTicket() {
  if (!confirm('Are you sure you want to close this ticket?')) return;
  closing.value = true;
  try {
    await $fetch(`${config.public.apiBase}/support/tickets/${route.params.id}/close`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token.value}` },
    });
    await fetchTicket();
  } catch (err) {
    console.error('Failed to close ticket:', err);
    alert('Failed to close ticket. Please try again.');
  } finally {
    closing.value = false;
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

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

onMounted(() => fetchTicket());
</script>
