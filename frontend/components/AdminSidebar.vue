<template>
  <aside
    class="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900"
    :class="[
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      collapsed ? 'w-16' : 'w-60',
    ]"
  >
    <!-- Logo -->
    <div class="flex h-14 items-center border-b border-gray-200 dark:border-gray-800 px-4" :class="collapsed ? 'justify-center' : ''">
      <NuxtLink to="/admin" class="flex items-center gap-2" @click="closeIfMobile">
        <img src="/assets/bg/finflow.png" alt="FinFlow Logo" class="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
        <div v-if="!collapsed" class="flex flex-col">
          <span class="text-base font-semibold text-gray-900 dark:text-gray-100">FinFlow</span>
          <span class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Admin</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-3">
      <!-- Main -->
      <div class="mb-4">
        <p v-if="!collapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Main</p>
        <ul class="space-y-1">
          <li v-for="item in mainNavItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :title="collapsed ? item.label : undefined"
              :class="[
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive(item.to)
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              ]"
              @click="closeIfMobile"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span v-if="!collapsed" class="flex-1">{{ item.label }}</span>
              <span v-if="item.badge && !collapsed" class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-medium text-white">
                {{ item.badge }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Management -->
      <div class="mb-4">
        <p v-if="!collapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Management</p>
        <ul class="space-y-1">
          <li v-for="item in managementNavItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :title="collapsed ? item.label : undefined"
              :class="[
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive(item.to)
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              ]"
              @click="closeIfMobile"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- System -->
      <div class="mb-4">
        <p v-if="!collapsed" class="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">System</p>
        <ul class="space-y-1">
          <li v-for="item in systemNavItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :title="collapsed ? item.label : undefined"
              :class="[
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive(item.to)
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
              ]"
              @click="closeIfMobile"
            >
              <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              <span v-if="!collapsed">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>

    </nav>

    <!-- Logout -->
    <div class="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">
      <button
        type="button"
        :class="[
          'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
          collapsed ? 'justify-center' : 'gap-3',
        ]"
        @click="emit('logout')"
      >
        <IconLogout class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { h } from 'vue';

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
const IconUsers = createIcon(['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z']);
const IconCategories = createIcon(['M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z']);
const IconChat = createIcon(['M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z']);
const IconNotifications = createIcon(['M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9']);
const IconActivity = createIcon(['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2']);
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

const props = withDefaults(
  defineProps<{
    open?: boolean;
    collapsed?: boolean;
  }>(),
  {
    open: false,
    collapsed: false,
  },
);

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'update:collapsed', value: boolean): void;
  (e: 'logout'): void;
}>();

const route = useRoute();

const mainNavItems = computed(() => [
  { to: '/admin', label: 'Dashboard', icon: IconDashboard, badge: null },
  { to: '/admin/chat', label: 'Live Chat', icon: IconChat, badge: null },
]);

const managementNavItems = [
  { to: '/admin/users', label: 'Users', icon: IconUsers },
  { to: '/admin/categories', label: 'Categories', icon: IconCategories },
];

const systemNavItems = [
  { to: '/admin/notifications', label: 'Notifications', icon: IconNotifications },
  { to: '/admin/admin-logs', label: 'Admin Activity', icon: IconActivity },
  { to: '/admin/settings', label: 'Settings', icon: IconSettings },
];

function isActive(path: string) {
  if (path === '/admin') return route.path === '/admin';
  return route.path.startsWith(path);
}

function closeIfMobile() {
  if (import.meta.client && window.matchMedia('(max-width: 1023px)').matches) {
    emit('update:open', false);
  }
}
</script>
