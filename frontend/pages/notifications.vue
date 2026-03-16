<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Stay updated with your latest alerts</p>
      </div>
      <div class="flex items-center gap-3">
        <span
          v-if="unreadCount > 0"
          class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
        >
          {{ unreadCount }} unread
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-2 text-gray-500">
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading...
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else-if="notifications.length" class="space-y-3">
      <div
        v-for="n in notifications"
        :key="n.id"
        :class="[
          'cursor-pointer rounded-xl border p-4 transition-all duration-200',
          n.read
            ? 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
            : 'border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30'
        ]"
        @click="openNotification(n)"
      >
        <div class="flex items-start gap-4">
          <div :class="['flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', getTypeColor(n.type)]">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="normalizeType(n.type) === 'ALERT'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
              <path
                v-else-if="normalizeType(n.type) === 'WARNING'"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <h3 :class="['text-sm font-semibold', n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white']">
                {{ n.title }}
              </h3>
              <span class="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500">{{ formatDate(n.createdAt) }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ n.message }}</p>
            <button
              v-if="!n.read"
              type="button"
              class="mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              @click.stop="markRead(n.id)"
            >
              Mark as read
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No notifications</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">You're all caught up!</p>
    </div>

    <!-- Detail Modal (Name / Date / Title / Description) -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDetailModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4"
        @click.self="closeDetail"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showDetailModal"
            class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
          >
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Notification</h3>
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                @click="closeDetail"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div v-if="selectedNotification" class="space-y-4">
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedNotification.fromName || 'Admin' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Date</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatDateFull(selectedNotification.createdAt) }}</p>
                </div>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Title</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedNotification.title }}</p>
              </div>

              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Description</p>
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ selectedNotification.message }}</p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
  fromName?: string
  broadcastId?: string | null
}

const { $api } = useNuxtApp()

const loading = ref(true)
const notifications = ref<Notification[]>([])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const showDetailModal = ref(false)
const selectedNotification = ref<Notification | null>(null)

function normalizeType(type: string) {
  const t = (type ?? '').toUpperCase()
  if (t === 'ALERT' || t === 'ERROR') return 'ALERT'
  if (t === 'WARNING') return 'WARNING'
  return 'INFO'
}

function getTypeColor(type: string) {
  const t = normalizeType(type)
  switch (t) {
    case 'ALERT':
      return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    case 'WARNING':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
    default:
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
  }
}

function formatDate(date: string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateFull(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleString()
}

async function fetchNotifications() {
  loading.value = true
  try {
    notifications.value = await $api<Notification[]>('/notifications')
  } catch (e) {
    console.error('Failed to fetch notifications:', e)
  } finally {
    loading.value = false
  }
}

useAutoRefreshOnIdle(fetchNotifications)

async function markRead(id: string) {
  try {
    await $api(`/notifications/${id}/read`, { method: 'PATCH' })
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  } catch (e) {
    console.error('Failed to mark as read:', e)
  }
}

function openNotification(n: Notification) {
  selectedNotification.value = n
  showDetailModal.value = true
  if (!n.read) markRead(n.id)
}

function closeDetail() {
  showDetailModal.value = false
  selectedNotification.value = null
}

onMounted(() => {
  fetchNotifications()
})
</script>