<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <div class="flex">
      <Sidebar v-model:open="sidebarOpen" />

      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-gray-900/50 backdrop-blur-sm md:hidden"
        @click="sidebarOpen = false"
      />

      <div class="flex-1">
        <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
        <main class="p-4 md:p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false);
</script>
