<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-display">
    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-200"
      :class="[
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        sidebarCollapsed ? 'w-16' : 'w-60',
      ]"
    >
      <!-- Logo -->
      <div class="flex h-14 items-center border-b border-gray-200 dark:border-gray-800 px-4" :class="sidebarCollapsed ? 'justify-center' : ''">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
          <span v-if="!sidebarCollapsed" class="text-base font-semibold text-gray-900 dark:text-gray-100">FinFlow</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="h-[calc(100vh-3.5rem)] overflow-y-auto p-3">
        <!-- Main -->
        <div class="mb-4">
          <p v-if="!sidebarCollapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Main</p>
          <ul class="space-y-1">
            <li v-for="item in mainNavItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                :title="sidebarCollapsed ? item.label : undefined"
                :class="[
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  sidebarCollapsed ? 'justify-center' : 'gap-3',
                  isActive(item.to)
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span v-if="!sidebarCollapsed">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Financial -->
        <div class="mb-4">
          <p v-if="!sidebarCollapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Financial</p>
          <ul class="space-y-1">
            <li v-for="item in financialNavItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                :title="sidebarCollapsed ? item.label : undefined"
                :class="[
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  sidebarCollapsed ? 'justify-center' : 'gap-3',
                  isActive(item.to)
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span v-if="!sidebarCollapsed">{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div class="mb-4">
          <p v-if="!sidebarCollapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Support</p>
          <ul class="space-y-1">
            <li v-for="item in supportNavItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                :title="sidebarCollapsed ? item.label : undefined"
                :class="[
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  sidebarCollapsed ? 'justify-center' : 'gap-3',
                  isActive(item.to)
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span v-if="!sidebarCollapsed" class="flex-1">{{ item.label }}</span>
                <span v-if="item.badge && !sidebarCollapsed" class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {{ item.badge > 9 ? '9+' : item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Logout -->
        <div class="border-t border-gray-200 dark:border-gray-800 pt-3">
          <button
            type="button"
            :class="[
              'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
              sidebarCollapsed ? 'justify-center' : 'gap-3',
            ]"
            @click="handleLogout"
          >
            <IconLogout class="h-5 w-5 flex-shrink-0" />
            <span v-if="!sidebarCollapsed">Logout</span>
          </button>
        </div>
      </nav>
    </aside>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Main Content -->
    <div :class="['min-h-screen flex-1 transition-all duration-200', sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60']">
      <!-- Header -->
      <header class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:px-6">
        <div class="flex items-center gap-3">
          <!-- Mobile Menu -->
          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Collapse Toggle -->
          <button
            type="button"
            class="hidden rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:block"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <svg v-if="!sidebarCollapsed" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Search -->
          <div class="relative hidden md:block">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search..."
              class="h-9 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-3 text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:border-gray-300 dark:focus:border-gray-600 focus:bg-white dark:focus:bg-gray-900 focus:outline-none"
            />
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Theme Toggle -->
          <button
            type="button"
            class="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="toggleTheme"
          >
            <svg v-if="isDark" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Notifications -->
          <NuxtLink to="/notifications" class="relative rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="unreadNotifications > 0" class="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </NuxtLink>

          <!-- Profile -->
          <div class="relative" data-profile-dropdown>
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="profileOpen = !profileOpen"
            >
              <img
                v-if="avatarSrc"
                :src="avatarSrc"
                alt="Avatar"
                class="h-8 w-8 rounded-full object-cover"
              />
              <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 dark:bg-gray-100 text-sm font-medium text-white dark:text-gray-900">
                {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="hidden text-left md:block">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ authStore.user?.name || 'User' }}</p>
              </div>
              <svg class="hidden h-4 w-4 text-gray-400 dark:text-gray-500 md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div
                v-if="profileOpen"
                class="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-1 shadow-lg"
              >
                <div class="border-b border-gray-100 dark:border-gray-800 px-4 py-2">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
                </div>
                <NuxtLink
                  to="/settings/profile"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  @click="profileOpen = false"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </NuxtLink>
                <NuxtLink
                  to="/settings/preferences"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  @click="profileOpen = false"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </NuxtLink>
                <div class="border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    @click="handleLogout"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { resolveApiUrl } from '~/composables/useApiAssetUrl';

function createIcon(paths: string[]) {
  return defineComponent({
    setup() {
      return () =>
        h(
          'svg',
          { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
          paths.map((d) => h('path', { d, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2' })),
        );
    },
  });
}

const IconDashboard = createIcon(['M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6']);
const IconWallet = createIcon(['M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z']);
const IconAnalytics = createIcon(['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z']);
const IconIncome = createIcon(['M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z']);
const IconExpense = createIcon(['M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z']);
const IconBudget = createIcon(['M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z']);
const IconGoals = createIcon(['M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z']);
const IconTransactions = createIcon(['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2']);
const IconNotifications = createIcon(['M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9']);
const IconChat = createIcon(['M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z']);
const IconSettings = defineComponent({
  setup() {
    return () =>
      h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
        h('path', { d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2' }),
        h('path', { d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2' }),
      ]);
  },
});
const IconLogout = createIcon(['M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1']);

const authStore = useAuthStore();
const route = useRoute();
const config = useRuntimeConfig();
const token = useCookie('access_token');

const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);
const profileOpen = ref(false);
const searchQuery = ref('');
const isDark = ref(false);
const unreadNotifications = ref(0);

const avatarSrc = computed(() => {
  const raw = authStore.user?.avatar;
  if (!raw) return '';
  const resolved = resolveApiUrl(raw);
  if (!resolved) return '';
  const buster = authStore.avatarBuster;
  if (!buster) return resolved;
  const sep = resolved.includes('?') ? '&' : '?';
  return `${resolved}${sep}v=${buster}`;
});

const mainNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { to: '/wallets', label: 'Wallets', icon: IconWallet },
  { to: '/analytics', label: 'Analytics', icon: IconAnalytics },
];

const financialNavItems = [
  { to: '/income', label: 'Income', icon: IconIncome },
  { to: '/expenses', label: 'Expenses', icon: IconExpense },
  { to: '/budgets', label: 'Budgets', icon: IconBudget },
  { to: '/goals', label: 'Goals', icon: IconGoals },
  { to: '/transactions', label: 'Transactions', icon: IconTransactions },
];

const supportNavItems = computed(() => [
  { to: '/notifications', label: 'Notifications', icon: IconNotifications, badge: unreadNotifications.value > 0 ? unreadNotifications.value : null },
  { to: '/support/chat', label: 'Live Chat', icon: IconChat, badge: null },
  { to: '/settings/profile', label: 'Settings', icon: IconSettings, badge: null },
]);

function isActive(path: string) {
  if (path === '/dashboard') return route.path === '/dashboard' || route.path === '/';
  return route.path.startsWith(path);
}

function toggleTheme() {
  isDark.value = !isDark.value;
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value);
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }
}

async function handleLogout() {
  await authStore.logout('/auth/login');
}

async function fetchUnreadNotifications() {
  try {
    const res = await $fetch<any[]>(`${config.public.apiBase}/notifications`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    unreadNotifications.value = res.filter((n: any) => !n.read).length;
  } catch {
    unreadNotifications.value = 0;
  }
}

onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme');
    isDark.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark.value);
    fetchUnreadNotifications();

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-profile-dropdown]')) {
        profileOpen.value = false;
      }
    });
  }
});
</script>
