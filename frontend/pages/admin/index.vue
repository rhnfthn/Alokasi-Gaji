<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's what's happening on your platform.</p>
      </div>

      <!-- Stats Cards -->
      <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <div :class="['flex h-10 w-10 items-center justify-center rounded-lg', stat.bgColor, stat.darkBgColor]">
              <component :is="stat.icon" :class="['h-5 w-5', stat.iconColor]" />
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
              <div class="flex items-baseline gap-2">
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ stat.value }}</p>
                <span v-if="stat.hint" class="text-xs text-gray-400 dark:text-gray-500">{{ stat.hint }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Charts -->
      <div class="mb-6 grid gap-6 lg:grid-cols-2">
        <!-- User Growth Chart -->
        <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-medium text-gray-900 dark:text-gray-100">User Growth</h3>
          <div class="h-48 flex items-end gap-2">
            <div v-for="(bar, i) in userGrowthData" :key="i" class="flex-1 flex flex-col items-center">
              <div class="w-full rounded-t bg-gray-900 dark:bg-gray-100 transition-all hover:opacity-80" :style="{ height: bar.value + '%' }"></div>
              <span class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ bar.label }}</span>
            </div>
          </div>
        </div>

        <!-- Activity Chart -->
        <div class="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-medium text-gray-900 dark:text-gray-100">Transaction Activity</h3>
          <div class="h-48 flex items-end gap-2">
            <div v-for="(bar, i) in activityData" :key="i" class="flex-1 flex flex-col items-center">
              <div class="w-full rounded-t transition-all hover:opacity-80" :class="bar.color" :style="{ height: bar.value + '%' }"></div>
              <span class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ bar.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Recent Users -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-900 dark:text-gray-100">Recent Users</h3>
            <NuxtLink to="/admin/users" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">View all</NuxtLink>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div v-if="loadingUsers" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
            <div v-else-if="recentUsers.length === 0" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No users found</div>
            <div v-for="user in recentUsers" :key="user.id" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white dark:bg-gray-100 dark:text-gray-900">
                {{ user.name.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</p>
                <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
              </div>
              <span :class="['rounded-full px-2 py-0.5 text-xs font-medium', user.role === 'ADMIN' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300']">
                {{ user.role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Recent Chat Messages -->
        <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h3 class="font-medium text-gray-900 dark:text-gray-100">Recent Chat Messages</h3>
            <NuxtLink to="/admin/chat" class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">View all</NuxtLink>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div v-if="loadingChats" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</div>
            <div v-else-if="recentChats.length === 0" class="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No messages found</div>
            <div v-for="chat in recentChats" :key="chat.id" class="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium flex-shrink-0', chat.isAdmin ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200']">
                {{ chat.sender.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{{ chat.sender }}</p>
                  <span class="text-xs text-gray-400 dark:text-gray-500">{{ chat.time }}</span>
                </div>
                <p class="truncate text-xs text-gray-600 dark:text-gray-400">{{ chat.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

import { defineComponent, h } from 'vue';

const IconUsers = defineComponent({
  name: 'IconUsers',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        { ...attrs, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          }),
        ],
      );
  },
});

const IconChat = defineComponent({
  name: 'IconChat',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        { ...attrs, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
          }),
        ],
      );
  },
});

const IconFlags = defineComponent({
  name: 'IconFlags',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        { ...attrs, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M5 21V4m0 0h11l-1 5 1 5H5',
          }),
        ],
      );
  },
});

const IconNewUsers = defineComponent({
  name: 'IconNewUsers',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'svg',
        { ...attrs, fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            'stroke-width': '2',
            d: 'M18 9a4 4 0 11-8 0 4 4 0 018 0zM6 20a6 6 0 0112 0v1H6v-1z',
          }),
        ],
      );
  },
});

type DashboardStats = {
  users: { total: number; newToday: number };
  tickets: { total: number; open: number };
  featureFlags: { total: number; enabled: number };
};

type RecentUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

type ChatMessage = {
  id: string;
  sender: string;
  message: string;
  time: string;
  isAdmin: boolean;
};

const config = useRuntimeConfig();
const token = useCookie('access_token');

const loadingStats = ref(true);
const loadingUsers = ref(true);
const loadingChats = ref(false);

const dashboardStats = ref<DashboardStats | null>(null);
const recentUsers = ref<RecentUser[]>([]);
const recentChats = ref<ChatMessage[]>([]);

// Mock analytics data
const userGrowthData = ref([
  { label: 'Mon', value: 60 },
  { label: 'Tue', value: 75 },
  { label: 'Wed', value: 85 },
  { label: 'Thu', value: 70 },
  { label: 'Fri', value: 90 },
  { label: 'Sat', value: 80 },
  { label: 'Sun', value: 95 },
]);

const activityData = ref([
  { label: 'Mon', value: 50, color: 'bg-emerald-500 dark:bg-emerald-600' },
  { label: 'Tue', value: 65, color: 'bg-blue-500 dark:bg-blue-600' },
  { label: 'Wed', value: 70, color: 'bg-purple-500 dark:bg-purple-600' },
  { label: 'Thu', value: 55, color: 'bg-orange-500 dark:bg-orange-600' },
  { label: 'Fri', value: 80, color: 'bg-red-500 dark:bg-red-600' },
  { label: 'Sat', value: 60, color: 'bg-yellow-500 dark:bg-yellow-600' },
  { label: 'Sun', value: 75, color: 'bg-pink-500 dark:bg-pink-600' },
]);

const stats = computed(() => {
  const s = dashboardStats.value;
  return [
    {
      label: 'Total Users',
      value: s ? s.users.total.toLocaleString() : '—',
      hint: s && s.users.newToday > 0 ? `+${s.users.newToday} today` : '',
      bgColor: 'bg-gray-100',
      darkBgColor: 'dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400',
      icon: IconUsers,
    },
    {
      label: 'Active Chats',
      value: s ? s.tickets.open.toLocaleString() : '—',
      hint: s ? `${s.tickets.total} total` : '',
      bgColor: 'bg-emerald-50',
      darkBgColor: 'dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: IconChat,
    },
    {
      label: 'Feature Flags',
      value: s ? s.featureFlags.enabled.toLocaleString() : '—',
      hint: s ? `${s.featureFlags.total} total` : '',
      bgColor: 'bg-blue-50',
      darkBgColor: 'dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: IconFlags,
    },
    {
      label: 'New Today',
      value: s ? s.users.newToday.toLocaleString() : '—',
      hint: '',
      bgColor: 'bg-purple-50',
      darkBgColor: 'dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      icon: IconNewUsers,
    },
  ];
});

async function fetchStats() {
  loadingStats.value = true;
  try {
    dashboardStats.value = await $fetch<DashboardStats>(`${config.public.apiBase}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    loadingStats.value = false;
  }
}

async function fetchRecentUsers() {
  loadingUsers.value = true;
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/admin/users/overview?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    recentUsers.value = (response.users ?? []).map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loadingUsers.value = false;
  }
}

async function fetchRecentChats() {
  loadingChats.value = true;
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/admin/chat/recent?limit=5`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    recentChats.value = (response.messages ?? []).map((msg: any) => {
      const date = new Date(msg.createdAt);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

      let timeStr = '';
      if (diffMinutes < 1) timeStr = 'Just now';
      else if (diffMinutes < 60) timeStr = `${diffMinutes}m ago`;
      else timeStr = `${Math.floor(diffMinutes / 60)}h ago`;

      return {
        id: msg.id,
        sender: msg.user?.name || 'Unknown',
        message: msg.content,
        time: timeStr,
        isAdmin: msg.isAdminReply || false,
      };
    });
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    recentChats.value = [];
  } finally {
    loadingChats.value = false;
  }
}

onMounted(async () => {
  await Promise.all([fetchStats(), fetchRecentUsers(), fetchRecentChats()]);
});
</script>
