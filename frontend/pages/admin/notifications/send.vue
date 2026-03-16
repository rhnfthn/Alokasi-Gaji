<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Breadcrumb -->
      <nav class="mb-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink to="/admin/notifications" class="hover:text-indigo-600 dark:hover:text-indigo-400">Notifications</NuxtLink>
        <span>/</span>
        <span class="text-gray-900 dark:text-white">Send New</span>
      </nav>

      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Send Notification</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Broadcast a message to your users</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <form class="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900" @submit.prevent="send">
            <!-- Type -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Notification Type</label>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  v-for="type in notificationTypes"
                  :key="type.value"
                  type="button"
                  :class="[
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all',
                    form.type === type.value
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  ]"
                  @click="form.type = type.value"
                >
                  <span class="text-2xl">{{ type.icon }}</span>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Title -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input
                v-model="form.title"
                type="text"
                required
                maxlength="100"
                placeholder="Notification title..."
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p class="mt-1 text-xs text-gray-500">{{ form.title.length }}/100 characters</p>
            </div>

            <!-- Message -->
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                v-model="form.message"
                rows="4"
                required
                maxlength="500"
                placeholder="Write your notification message..."
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">{{ form.message.length }}/500 characters</p>
            </div>

            <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
              <NuxtLink
                to="/admin/notifications"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </NuxtLink>
              <button
                type="submit"
                class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="sending"
              >
                {{ sending ? 'Sending…' : 'Send Now' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-1">
          <div class="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Preview</h3>
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <svg class="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">{{ form.title || 'Notification Title' }}</p>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{{ form.message || 'Your notification message will appear here...' }}</p>
                  <p class="mt-2 text-xs text-gray-400">Just now</p>
                </div>
              </div>
            </div>

            <div class="mt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Type</span>
                <span class="font-medium text-gray-900 dark:text-white capitalize">{{ form.type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Recipients</span>
                <span class="font-medium text-gray-900 dark:text-white">All Users</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Delivery</span>
                <span class="font-medium text-gray-900 dark:text-white">Immediate</span>
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

const { $api } = useNuxtApp();

const sending = ref(false);
const error = ref('');

const form = ref({
  type: 'announcement',
  title: '',
  message: '',
});

const notificationTypes = [
  { value: 'announcement', label: 'Announcement', icon: '??' },
  { value: 'update', label: 'Update', icon: '??' },
  { value: 'promotion', label: 'Promotion', icon: '??' },
  { value: 'alert', label: 'Alert', icon: '??' },
];

async function send() {
  error.value = '';
  sending.value = true;
  try {
    await $api('/admin/notifications', {
      method: 'POST',
      body: {
        title: form.value.title,
        body: form.value.message,
        type: form.value.type,
      },
    });
    await navigateTo('/admin/notifications');
  } catch (e: any) {
    error.value = e?.data?.message ?? e?.message ?? 'Send failed';
  } finally {
    sending.value = false;
  }
}
</script>