<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Analytics</h1>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <AnalyticsCharts
          :spending-by-category="analyticsStore.spendingByCategory"
          :income-expense="analyticsStore.incomeExpense"
          :monthly-trend="analyticsStore.monthlyTrend"
        />
      </div>

      <div class="flex h-[560px] flex-col rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900 dark:text-white">Chat</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                <span v-if="isConnected" class="inline-flex items-center gap-1.5">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Online
                </span>
                <span v-else class="inline-flex items-center gap-1.5">
                  <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                  Connecting...
                </span>
              </div>
            </div>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ messages.length }} msgs</span>
        </div>

        <div ref="messagesContainer" class="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
            <p class="text-xs text-red-600 dark:text-red-300">{{ error }}</p>
          </div>

          <div v-if="messages.length === 0" class="flex h-full items-center justify-center">
            <div class="text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
              <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">Ask support anything</p>
            </div>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['flex', msg.isMe ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                'max-w-[85%] rounded-lg px-3 py-2',
                msg.isMe ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white',
              ]"
            >
              <p v-if="!msg.isMe" class="mb-0.5 text-[11px] font-medium opacity-70">{{ msg.sender }}</p>
              <p class="text-sm">{{ msg.text }}</p>
              <p class="mt-0.5 text-[11px] opacity-70">{{ formatTime(msg.timestamp) }}</p>
            </div>
          </div>

          <div v-if="isTyping" class="flex justify-start">
            <div class="max-w-[85%] rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Support is typing...
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 p-3 dark:border-gray-800">
          <form class="flex gap-2" @submit.prevent="sendMessage">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type..."
              class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-300 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              :disabled="!isConnected || isSending"
            />
            <button
              type="submit"
              class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              :disabled="!newMessage.trim() || !isConnected || isSending"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const analyticsStore = useAnalyticsStore();
const authStore = useAuthStore();
const { $api } = useNuxtApp();

interface Message {
  text: string;
  sender: string;
  timestamp: Date;
  isMe: boolean;
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const isConnected = ref(false);
const isTyping = ref(false);
const isSending = ref(false);
const error = ref('');
const messagesContainer = ref<HTMLDivElement | null>(null);
const ticketId = ref<string | null>(null);

let pollInterval: ReturnType<typeof setInterval> | null = null;

async function ensureProfileLoaded() {
  if (!authStore.isAuthenticated) return;
  if (!authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      error.value = 'Failed to load user profile';
    }
  }
}

async function loadLatestTicket() {
  try {
    error.value = '';
    const res = await $api<any>('/support/tickets', { query: { page: 1, limit: 1 } });

    const latest = res?.tickets?.[0];
    ticketId.value = latest?.id ?? null;
    isConnected.value = true;

    if (ticketId.value) {
      await loadTicket(ticketId.value);
    } else {
      messages.value = [];
    }
  } catch (e: any) {
    error.value = `Failed to load chat: ${e?.message || 'Unknown error'}`;
    isConnected.value = false;
  }
}

async function loadTicket(id: string) {
  try {
    error.value = '';
    const ticket = await $api<any>(`/support/tickets/${id}`);
    const myId = authStore.user?.id;

    const items: Message[] = [];

    if (ticket?.description) {
      items.push({
        text: ticket.description,
        sender: ticket.user?.name || 'You',
        timestamp: new Date(ticket.createdAt),
        isMe: true,
      });
    }

    for (const reply of ticket?.replies ?? []) {
      items.push({
        text: reply.message,
        sender: reply.user?.name || (reply.isAdmin ? 'Support' : 'User'),
        timestamp: new Date(reply.createdAt),
        isMe: Boolean(myId && reply.userId === myId),
      });
    }

    messages.value = items;
    isConnected.value = true;
    scrollToBottom();
  } catch (e: any) {
    error.value = `Failed to load messages: ${e?.message || 'Unknown error'}`;
    isConnected.value = false;
  }
}

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !isConnected.value || isSending.value) return;

  isSending.value = true;
  error.value = '';
  try {
    if (!ticketId.value) {
      const created = await $api<any>('/support/tickets', {
        method: 'POST',
        body: { subject: 'Live Chat', message: text },
      });
      ticketId.value = created?.id ?? null;
    } else {
      await $api<any>(`/support/tickets/${ticketId.value}/reply`, {
        method: 'POST',
        body: { message: text },
      });
    }

    newMessage.value = '';
    if (ticketId.value) await loadTicket(ticketId.value);
  } catch (e: any) {
    error.value = `Failed to send message: ${e?.message || 'Unknown error'}`;
    isConnected.value = false;
  } finally {
    isSending.value = false;
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (!messagesContainer.value) return;
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  });
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
}

async function refresh() {
  await Promise.all([
    analyticsStore.fetchSpendingCategory(),
    analyticsStore.fetchIncomeExpense(6),
    analyticsStore.fetchMonthlyTrend(6),
  ]);
}

useAutoRefreshOnIdle(refresh);

onMounted(() => {
  refresh();
  void (async () => {
    await ensureProfileLoaded();
    isTyping.value = false;
    await loadLatestTicket();

    pollInterval = setInterval(async () => {
      if (ticketId.value) {
        await loadTicket(ticketId.value);
      } else {
        await loadLatestTicket();
      }
    }, 5000);
  })();
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = null;
});
</script>
