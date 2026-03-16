<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>

    <!-- Profile Section -->
    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Update your profile information and avatar</p>
      </div>
      <div class="p-6 space-y-6">
        <!-- Avatar Upload -->
        <div class="flex items-start gap-6">
          <div class="flex-shrink-0">
            <div v-if="avatarSrc" class="relative">
              <img :src="avatarSrc" alt="avatar" class="h-24 w-24 rounded-full border-2 border-gray-200 object-cover dark:border-gray-700" />
              <label class="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
              </label>
            </div>
            <div v-else class="relative">
              <div class="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <label class="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="uploadAvatar" />
              </label>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">Profile Picture</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload a new profile picture. JPG, PNG or GIF (max 2MB)</p>
            <div v-if="uploadMessage" class="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{{ uploadMessage }}</div>
            <div v-if="uploadError" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ uploadError }}</div>
          </div>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input v-model="profileForm.name" placeholder="Enter your name" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input v-model="profileForm.email" type="email" class="mt-1 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-400" readonly disabled />
            </div>
          </div>

          <div v-if="profileError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ profileError }}</div>
          <div v-if="profileMessage" class="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{{ profileMessage }}</div>

          <div class="mt-4 flex justify-end">
            <button type="submit" class="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="profileLoading">
              {{ profileLoading ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Security Section -->
    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Security</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage your password and security settings</p>
      </div>
      <div class="p-6">
        <form @submit.prevent="changePassword">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input v-model="securityForm.currentPassword" type="password" placeholder="Enter current password" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input v-model="securityForm.newPassword" type="password" placeholder="Enter new password" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </div>
          </div>

          <div v-if="securityError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ securityError }}</div>
          <div v-if="securityMessage" class="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{{ securityMessage }}</div>

          <div class="mt-4 flex justify-end">
            <button type="submit" class="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="securityLoading">
              {{ securityLoading ? 'Changing…' : 'Change Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Preferences Section -->
    <div class="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Preferences</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Customize your app experience</p>
      </div>
      <div class="p-6">
        <form @submit.prevent="savePreferences">
          <div class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Currency</label>
              <input v-model="preferencesForm.defaultCurrency" placeholder="e.g., USD, IDR, EUR" class="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100" />
            </div>
            <div class="flex items-center gap-3">
              <input v-model="preferencesForm.darkMode" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700" />
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Dark Mode</label>
            </div>
          </div>

          <div v-if="preferencesError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ preferencesError }}</div>
          <div v-if="preferencesMessage" class="mt-3 text-sm text-emerald-600 dark:text-emerald-400">{{ preferencesMessage }}</div>

          <div class="mt-4 flex justify-end">
            <button type="submit" class="rounded-lg bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" :disabled="preferencesLoading">
              {{ preferencesLoading ? 'Saving…' : 'Save Preferences' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Settings = { id: string; userId: string; defaultCurrency?: string | null; darkMode?: boolean | null };

import { resolveApiUrl } from '~/composables/useApiAssetUrl';

const authStore = useAuthStore();

// Profile
const profileForm = ref({ name: authStore.user?.name ?? '', email: authStore.user?.email ?? '' });
const profileLoading = ref(false);
const profileError = ref('');
const profileMessage = ref('');

// Avatar
const avatarInput = ref<HTMLInputElement | null>(null);
const uploadMessage = ref('');
const uploadError = ref('');

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

// Security
const securityForm = ref({ currentPassword: '', newPassword: '' });
const securityLoading = ref(false);
const securityError = ref('');
const securityMessage = ref('');

// Preferences
const preferencesForm = ref({ defaultCurrency: 'USD', darkMode: false });
const preferencesLoading = ref(false);
const preferencesError = ref('');
const preferencesMessage = ref('');

// Watch user changes
watch(
  () => authStore.user,
  (u) => {
    if (!u) return;
    profileForm.value.name = u.name;
    profileForm.value.email = u.email;
  },
  { immediate: true },
);

// Profile functions
async function saveProfile() {
  profileError.value = '';
  profileMessage.value = '';
  profileLoading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/users/me', {
      method: 'PATCH',
      body: { name: profileForm.value.name },
    });
    await authStore.fetchProfile();
    profileMessage.value = 'Profile updated successfully!';
  } catch (e: any) {
    profileError.value = e?.data?.message ?? e?.message ?? 'Update failed';
  } finally {
    profileLoading.value = false;
  }
}

async function uploadAvatar() {
  const file = avatarInput.value?.files?.[0];
  if (!file) return;

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'File size must be less than 2MB';
    return;
  }

  uploadMessage.value = '';
  uploadError.value = '';
  profileLoading.value = true;
  try {
    const config = useRuntimeConfig();
    const fd = new FormData();
    fd.append('file', file);

    const res = await $fetch<{ success: boolean; url?: string }>(`${config.public.apiBase}/upload/avatar`, {
      method: 'POST',
      body: fd,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    });

    if (res.success) {
      await authStore.fetchProfile();
      uploadMessage.value = 'Avatar updated successfully!';
    } else {
      uploadError.value = 'Upload failed';
    }
  } catch (e: any) {
    uploadError.value = e?.data?.message ?? e?.message ?? 'Upload failed';
  } finally {
    profileLoading.value = false;
  }
}

// Security functions
async function changePassword() {
  securityError.value = '';
  securityMessage.value = '';

  if (!securityForm.value.currentPassword || !securityForm.value.newPassword) {
    securityError.value = 'Please fill in both fields';
    return;
  }

  securityLoading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/users/change-password', {
      method: 'PATCH',
      body: {
        currentPassword: securityForm.value.currentPassword,
        newPassword: securityForm.value.newPassword
      },
    });
    securityMessage.value = 'Password changed successfully!';
    securityForm.value.currentPassword = '';
    securityForm.value.newPassword = '';
  } catch (e: any) {
    securityError.value = e?.data?.message ?? e?.message ?? 'Change failed';
  } finally {
    securityLoading.value = false;
  }
}

// Preferences functions
async function loadPreferences() {
  preferencesError.value = '';
  try {
    const { $api } = useNuxtApp();
    const s = await $api<Settings>('/settings');
    preferencesForm.value.defaultCurrency = s.defaultCurrency || 'USD';
    preferencesForm.value.darkMode = Boolean(s.darkMode);
  } catch (e: any) {
    preferencesError.value = e?.data?.message ?? e?.message ?? 'Load failed';
  }
}

async function savePreferences() {
  preferencesError.value = '';
  preferencesMessage.value = '';
  preferencesLoading.value = true;
  try {
    const { $api } = useNuxtApp();
    await $api('/settings', {
      method: 'PATCH',
      body: {
        defaultCurrency: preferencesForm.value.defaultCurrency,
        darkMode: preferencesForm.value.darkMode
      },
    });
    preferencesMessage.value = 'Preferences saved successfully!';
  } catch (e: any) {
    preferencesError.value = e?.data?.message ?? e?.message ?? 'Save failed';
  } finally {
    preferencesLoading.value = false;
  }
}

onMounted(() => {
  loadPreferences();
});
</script>
