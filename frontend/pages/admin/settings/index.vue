<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Platform Settings</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure platform-wide settings</p>
      </div>

      <!-- Settings Navigation -->
      <div class="mb-6 border-b border-gray-200 dark:border-gray-800">
        <nav class="flex gap-6">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'border-b-2 pb-3 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">Platform Information</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Platform Name</label>
              <input
                v-model="settings.platformName"
                type="text"
                class="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</label>
              <input
                v-model="settings.supportEmail"
                type="email"
                class="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
              <select
                v-model="settings.defaultCurrency"
                class="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value="IDR">Indonesian Rupiah (IDR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
              <select
                v-model="settings.timezone"
                class="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              >
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">Features</h3>
          <div class="space-y-4">
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">User Registration</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Allow new users to register</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.registrationEnabled ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.registrationEnabled = !settings.registrationEnabled"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full transition-transform', settings.registrationEnabled ? 'translate-x-6 bg-white dark:bg-gray-900' : 'translate-x-1 bg-white']" />
              </button>
            </label>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">Email Verification</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Require email verification for new accounts</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.emailVerificationRequired ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.emailVerificationRequired = !settings.emailVerificationRequired"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full transition-transform', settings.emailVerificationRequired ? 'translate-x-6 bg-white dark:bg-gray-900' : 'translate-x-1 bg-white']" />
              </button>
            </label>
            <label class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900 dark:text-gray-100">Maintenance Mode</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Temporarily disable access to the platform</p>
              </div>
              <button
                type="button"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settings.maintenanceMode ? 'bg-red-600 dark:bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
                ]"
                @click="settings.maintenanceMode = !settings.maintenanceMode"
              >
                <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1']" />
              </button>
            </label>
          </div>
        </div>
      </div>

      <!-- Limits Settings -->
      <div v-if="activeTab === 'limits'" class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">User Limits</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Max Wallets per User</label>
              <input
                v-model.number="settings.maxWallets"
                type="text"
                min="1"
                class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Max Daily Transactions</label>
              <input
                v-model.number="settings.maxDailyTransactions"
                type="text"
                min="1"
                class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Max Transaction Amount (IDR)</label>
              <input
                v-model="maxTransactionAmountText"
                type="text"
                inputmode="numeric"
                class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">API Rate Limits</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Requests per Minute</label>
              <input
                v-model.number="settings.apiRateLimit"
                type="text"
                min="1"
                class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div v-if="activeTab === 'email'" class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 class="mb-4 font-semibold text-gray-900 dark:text-gray-100">SMTP Configuration</h3>
          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Host</label>
                <input
                  v-model="settings.smtpHost"
                  type="text"
                  placeholder="smtp.example.com"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Port</label>
                <input
                  v-model.number="settings.smtpPort"
                  type="text"
                  placeholder="587"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
              </div>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Username</label>
                <input
                  v-model="settings.smtpUsername"
                  type="text"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">SMTP Password</label>
                <input
                  v-model="settings.smtpPassword"
                  type="password"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
                />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">From Email</label>
              <input
                v-model="settings.fromEmail"
                type="email"
                placeholder="noreply@example.com"
                class="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <button
              type="button"
              class="rounded-lg border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
              @click="testEmailConnection"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div v-if="activeTab === 'advanced'" class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Feature Flags Card -->
          <NuxtLink
            to="/admin/settings/feature-flags"
            class="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-gray-300">
                  Feature Flags
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Toggle platform features on and off without deploying code
                </p>
              </div>
              <svg class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Category Templates Card -->
          <NuxtLink
            to="/admin/settings/category-templates"
            class="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-gray-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-600"
          >
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 group-hover:text-gray-700 dark:text-gray-100 dark:group-hover:text-gray-300">
                  Category Templates
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Default categories assigned to new users automatically
                </p>
              </div>
              <svg class="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div class="flex items-start gap-3">
            <svg class="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 class="font-medium text-amber-800 dark:text-amber-200">Advanced Settings Caution</h4>
              <p class="mt-1 text-sm text-amber-700 dark:text-amber-300">
                Changes to these settings can affect the entire platform. Please ensure you understand the impact before making changes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          @click="saveSettings"
        >
          Save Changes
        </button>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' });

const activeTab = ref('general');

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Limits', value: 'limits' },
  { label: 'Email', value: 'email' },
  { label: 'Advanced', value: 'advanced' },
];

const settings = ref({
  // General
  platformName: 'FinTrack',
  supportEmail: 'support@fintrack.id',
  defaultCurrency: 'IDR',
  timezone: 'Asia/Jakarta',
  registrationEnabled: true,
  emailVerificationRequired: true,
  maintenanceMode: false,
  // Limits
  maxWallets: 10,
  maxDailyTransactions: 100,
  maxTransactionAmount: 100000000,
  apiRateLimit: 60,
  // Email
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpUsername: '',
  smtpPassword: '',
  fromEmail: 'noreply@fintrack.id',
});

const maxTransactionAmountText = ref('');
watch(
  () => settings.value.maxTransactionAmount,
  (v) => {
    maxTransactionAmountText.value = formatRupiah(Number(v ?? 0));
  },
  { immediate: true },
);

function onMaxTransactionAmountInput() {
  settings.value.maxTransactionAmount = parseRupiah(maxTransactionAmountText.value);
}

function testEmailConnection() {
  alert('Testing email connection...');
}

function saveSettings() {
  alert('Settings saved successfully!');
}
</script>

