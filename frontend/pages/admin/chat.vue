<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Live Chat - Admin Panel</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage user conversations in real-time</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Active Chats List -->
      <div class="lg:col-span-1 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 class="font-semibold text-gray-900 dark:text-white">Active Chats</h2>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ activeUsers.length }} users online</p>
        </div>
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="user in activeUsers"
            :key="user.userId"
            :class="[
              'cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700',
              selectedUser?.userId === user.userId ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
            ]"
            @click="selectUser(user)"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                {{ user.userName.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{{ user.userName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="user.unreadCount" class="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {{ user.unreadCount }}
                  </span>
                  <span v-else>Online</span>
                </p>
              </div>
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="lg:col-span-2 flex h-[calc(100vh-16rem)] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div v-if="!selectedUser" class="flex h-full items-center justify-center">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
          </div>
        </div>

        <template v-else>
          <!-- Chat Header -->
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                {{ selectedUser.userName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ selectedUser.userName }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </span>
                </p>
              </div>
            </div>
            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {{ getChatMessages().length }} messages
            </span>
          </div>

          <!-- Chat Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-for="(msg, index) in getChatMessages()"
              :key="index"
              :class="[
                'flex',
                msg.role === 'admin' ? 'justify-end' : 'justify-start',
              ]"
            >
              <div
                :class="[
                  'max-w-xs rounded-2xl px-4 py-3',
                  msg.role === 'admin'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white',
                ]"
              >
                <p v-if="msg.role !== 'admin'" class="mb-1 text-xs font-semibold opacity-70">{{ msg.sender }}</p>
                <p class="text-sm">{{ msg.text }}</p>
                <p :class="['mt-1 text-xs', msg.role === 'admin' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400']">
                  {{ formatTime(msg.timestamp) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="border-t border-gray-200 p-4 dark:border-gray-700">
            <form @submit.prevent="sendMessage">
              <div class="flex gap-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Type your message..."
                  class="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  :disabled="!isConnected"
                />
                <button
                  type="submit"
                  class="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!newMessage.trim() || !isConnected"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({ middleware: 'admin', layout: 'admin' });

interface Message {
  text: string
  sender: string
  timestamp: Date
  role: string
  userId?: string
}

interface ActiveUser {
  userId: string
  userName: string
  unreadCount?: number
}

const authStore = useAuthStore()
const { $api } = useNuxtApp()

const messages = ref<Record<string, Message[]>>({})
const activeUsers = ref<ActiveUser[]>([])
const selectedUser = ref<ActiveUser | null>(null)
const newMessage = ref('')
const isConnected = ref(false)
const messagesContainer = ref<HTMLDivElement | null>(null)

let pollInterval: ReturnType<typeof setInterval> | null = null

async function ensureProfileLoaded() {
  if (!authStore.isAuthenticated) return
  if (!authStore.user) {
    try {
      await authStore.fetchProfile()
    } catch {
      // admin middleware will handle redirect/logout
    }
  }
}

async function loadActiveChats() {
  try {
    const res = await $api<any>('/admin/tickets', {
      query: { page: 1, limit: 50 },
    })

    const tickets = (res?.tickets ?? []).filter((t: any) =>
      t?.status === 'OPEN' || t?.status === 'IN_PROGRESS'
    )

    activeUsers.value = tickets.map((t: any) => ({
      userId: t.id, // ticketId (keeps template changes minimal)
      userName: t.user?.name || 'User',
      unreadCount: 0,
    }))

    isConnected.value = true

    // If selected chat is no longer active, clear selection
    if (selectedUser.value && !activeUsers.value.find(u => u.userId === selectedUser.value?.userId)) {
      selectedUser.value = null
    }
  } catch (error) {
    console.error('Failed to load active chats:', error)
    isConnected.value = false
  }
}

async function loadChatMessages(ticketId: string) {
  try {
    const ticket = await $api<any>(`/admin/tickets/${ticketId}`)
    const items: Message[] = []

    if (ticket?.description) {
      items.push({
        text: ticket.description,
        sender: ticket.user?.name || 'User',
        timestamp: new Date(ticket.createdAt),
        role: 'user',
        userId: ticket.userId,
      })
    }

    for (const reply of ticket?.replies ?? []) {
      items.push({
        text: reply.message,
        sender: reply.user?.name || (reply.isAdmin ? 'Admin' : 'User'),
        timestamp: new Date(reply.createdAt),
        role: reply.isAdmin ? 'admin' : 'user',
        userId: reply.userId,
      })
    }

    messages.value[ticketId] = items
    isConnected.value = true
    scrollToBottom()
  } catch (error) {
    console.error('Failed to load chat messages:', error)
    isConnected.value = false
  }
}

function selectUser(user: ActiveUser) {
  selectedUser.value = user
  // Mark as read
  user.unreadCount = 0
  loadChatMessages(user.userId)
  scrollToBottom()
}

function getChatMessages(): Message[] {
  if (!selectedUser.value) return []
  return messages.value[selectedUser.value.userId] || []
}

function sendMessage() {
  void (async () => {
    const text = newMessage.value.trim()
    if (!text || !isConnected.value || !selectedUser.value) return

    try {
      await $api<any>(`/admin/tickets/${selectedUser.value.userId}/reply`, {
        method: 'POST',
        body: { message: text },
      })

      newMessage.value = ''
      await loadChatMessages(selectedUser.value.userId)
    } catch (error) {
      console.error('Failed to send message:', error)
      isConnected.value = false
    }
  })()
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

onMounted(() => {
  ensureProfileLoaded().finally(() => {
    void loadActiveChats()
    pollInterval = setInterval(async () => {
      await loadActiveChats()
      if (selectedUser.value) {
        await loadChatMessages(selectedUser.value.userId)
      }
    }, 3000)
  })
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>
