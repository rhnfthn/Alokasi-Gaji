<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-semibold text-gray-900">Live Chat</h1>
      <p class="mt-1 text-sm text-gray-500">Chat with our support team in real-time</p>
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-3">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <div class="flex h-[calc(100vh-14rem)] flex-col rounded-lg border border-gray-200 bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 class="font-medium text-gray-900">Support Chat</h2>
            <p class="text-xs text-gray-500">
              <span v-if="isConnected" class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Online
              </span>
              <span v-else class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                Connecting...
              </span>
            </p>
          </div>
        </div>
        <span class="text-xs text-gray-500">{{ messages.length }} messages</span>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 space-y-3">
        <div v-if="messages.length === 0" class="flex h-full items-center justify-center">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="mt-3 text-sm text-gray-500">No messages yet</p>
            <p class="mt-1 text-xs text-gray-400">Start a conversation with our support team</p>
          </div>
        </div>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['flex', msg.isMe ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'max-w-xs rounded-lg px-4 py-2.5',
              msg.isMe ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900',
            ]"
          >
            <p v-if="!msg.isMe" class="mb-1 text-xs font-medium text-gray-500">{{ msg.sender }}</p>
            <p class="text-sm">{{ msg.text }}</p>
            <p :class="['mt-1 text-xs', msg.isMe ? 'text-gray-400' : 'text-gray-500']">
              {{ formatTime(msg.timestamp) }}
            </p>
          </div>
        </div>

        <div v-if="isTyping" class="flex justify-start">
          <div class="max-w-xs rounded-lg bg-gray-100 px-4 py-2.5">
            <p class="text-xs text-gray-500">Support is typing...</p>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="border-t border-gray-200 p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm placeholder-gray-400 focus:border-gray-300 focus:outline-none"
            :disabled="!isConnected || isSending"
          />
          <button
            type="submit"
            class="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!newMessage.trim() || !isConnected || isSending"
          >
            <svg v-if="!isSending" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <svg v-else class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

interface Message {
  text: string
  sender: string
  timestamp: Date
  isMe: boolean
}

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const messages = ref<Message[]>([])
const newMessage = ref('')
const isConnected = ref(false)
const isTyping = ref(false)
const isSending = ref(false)
const error = ref('')
const messagesContainer = ref<HTMLDivElement | null>(null)

const ticketId = ref<string | null>(null)

let pollInterval: ReturnType<typeof setInterval> | null = null

async function ensureProfileLoaded() {
  if (!authStore.isAuthenticated) return
  if (!authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch (e) {
      error.value = 'Failed to load user profile'
    }
  }
}

async function loadLatestTicket() {
  try {
    error.value = ''
    const res = await $api<any>('/support/tickets', {
      query: { page: 1, limit: 1 }
    })

    const latest = res?.tickets?.[0]
    ticketId.value = latest?.id ?? null
    isConnected.value = true

    if (ticketId.value) {
      await loadTicket(ticketId.value)
    } else {
      messages.value = []
    }
  } catch (e: any) {
    error.value = `Failed to load chat: ${e.message || 'Unknown error'}`
    isConnected.value = false
  }
}

async function loadTicket(id: string) {
  try {
    error.value = ''
    const ticket = await $api<any>(`/support/tickets/${id}`)
    const myId = authStore.user?.id

    const items: Message[] = []

    if (ticket?.description) {
      items.push({
        text: ticket.description,
        sender: ticket.user?.name || 'You',
        timestamp: new Date(ticket.createdAt),
        isMe: true,
      })
    }

    for (const reply of ticket?.replies ?? []) {
      items.push({
        text: reply.message,
        sender: reply.user?.name || (reply.isAdmin ? 'Support' : 'User'),
        timestamp: new Date(reply.createdAt),
        isMe: Boolean(myId && reply.userId === myId),
      })
    }

    messages.value = items
    isConnected.value = true
    scrollToBottom()
  } catch (e: any) {
    error.value = `Failed to load messages: ${e.message || 'Unknown error'}`
    isConnected.value = false
  }
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !isConnected.value || isSending.value) return

  isSending.value = true
  error.value = ''

  try {
    if (!ticketId.value) {
      const created = await $api<any>('/support/tickets', {
        method: 'POST',
        body: {
          subject: 'Live Chat',
          message: text,
        },
      })
      ticketId.value = created?.id ?? null
    } else {
      await $api<any>(`/support/tickets/${ticketId.value}/reply`, {
        method: 'POST',
        body: { message: text },
      })
    }

    newMessage.value = ''
    if (ticketId.value) {
      await loadTicket(ticketId.value)
    }
  } catch (e: any) {
    error.value = `Failed to send message: ${e.message || 'Unknown error'}`
    isConnected.value = false
  } finally {
    isSending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

onMounted(async () => {
  try {
    await ensureProfileLoaded()
    isTyping.value = false
    await loadLatestTicket()

    pollInterval = setInterval(async () => {
      if (ticketId.value) {
        await loadTicket(ticketId.value)
      } else {
        await loadLatestTicket()
      }
    }, 3000)
  } catch (e) {
    error.value = 'Failed to initialize chat'
  }
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
