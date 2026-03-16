<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure platform security options</p>
      </div>

      <!-- Security Settings -->
      <div class="space-y-6">
        <!-- Authentication -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Authentication</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Session Timeout (minutes)</label>
              <input
                v-model.number="settings.sessionTimeout"
                type="number"
                min="5"
                class="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Users will be logged out after this period of inactivity</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Max Login Attempts</label>
              <input
                v-model.number="settings.maxLoginAttempts"
                type="number"
                min="1"
                class="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Account will be locked after this many failed attempts</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Lockout Duration (minutes)</label>
              <input
                v-model.number="settings.lockoutDuration"
                type="number"
                min="1"
                class="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <!-- Password Policy -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Password Policy</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Password Length</label>
              <input
                v-model.number="settings.minPasswordLength"
                type="number"
                min="6"
                max="32"
                class="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Require Uppercase Letter</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Password must contain at least one uppercase letter</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.requireUppercase ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.requireUppercase = !settings.requireUppercase"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.requireUppercase ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Require Number</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Password must contain at least one number</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.requireNumber ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.requireNumber = !settings.requireNumber"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.requireNumber ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Require Special Character</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Password must contain at least one special character (!@#$%^&*)</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.requireSpecialChar ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.requireSpecialChar = !settings.requireSpecialChar"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.requireSpecialChar ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
          </div>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Enable 2FA</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Allow users to enable two-factor authentication</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.twoFactorEnabled = !settings.twoFactorEnabled"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Require 2FA for Admins</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Admin accounts must have 2FA enabled</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.adminTwoFactorRequired ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.adminTwoFactorRequired = !settings.adminTwoFactorRequired"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.adminTwoFactorRequired ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
          </div>
        </div>

        <!-- IP Blocking -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">IP Blocking</h3>
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Auto-block Suspicious IPs</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Automatically block IPs with suspicious activity</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.autoBlockEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.autoBlockEnabled = !settings.autoBlockEnabled"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.autoBlockEnabled ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Blocked IP Addresses</label>
              <div class="space-y-2">
                <div v-for="(ip, index) in settings.blockedIps" :key="index" class="flex items-center gap-2">
                  <input
                    v-model="settings.blockedIps[index]"
                    type="text"
                    placeholder="192.168.1.1"
                    class="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    class="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    @click="removeBlockedIp(index)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="mt-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                @click="addBlockedIp"
              >
                + Add IP Address
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          @click="saveSettings"
        >
          Save Security Settings
        </button>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

const settings = ref({
  // Authentication
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  // Password Policy
  minPasswordLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  // 2FA
  twoFactorEnabled: true,
  adminTwoFactorRequired: true,
  // IP Blocking
  autoBlockEnabled: true,
  blockedIps: ['185.234.12.45', '103.45.67.89'],
});

function addBlockedIp() {
  settings.value.blockedIps.push('');
}

function removeBlockedIp(index: number) {
  settings.value.blockedIps.splice(index, 1);
}

function saveSettings() {
  alert('Security settings saved successfully!');
}
</script>
