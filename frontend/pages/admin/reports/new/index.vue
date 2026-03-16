<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New Report</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create and generate an aggregated report</p>
        </div>

        <NuxtLink
          to="/admin/reports"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </NuxtLink>
      </div>

      <div class="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div class="grid gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Weekly System Overview"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Optional"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select
              v-model="form.type"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="SYSTEM_OVERVIEW">System Overview</option>
              <option value="SUPPORT_OVERVIEW">Support Overview</option>
              <option value="FINANCE_OVERVIEW">Finance Overview</option>
            </select>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date From</label>
              <input
                v-model="form.dateFrom"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Date To</label>
              <input
                v-model="form.dateTo"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div class="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
              @click="createAndGenerate"
            >
              <span class="material-symbols-outlined text-[18px]">play_arrow</span>
              Create & Generate
            </button>

            <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ['admin'],
});

type ReportType = 'SYSTEM_OVERVIEW' | 'SUPPORT_OVERVIEW' | 'FINANCE_OVERVIEW';

type CreateReportResponse = {
  id: string;
};

type ReportDetailResponse = {
  id: string;
};

const config = useRuntimeConfig();
const token = useCookie('access_token');
const router = useRouter();

const submitting = ref(false);
const error = ref<string | null>(null);

const form = reactive<{
  title: string;
  description: string;
  type: ReportType;
  dateFrom: string;
  dateTo: string;
}>({
  title: '',
  description: '',
  type: 'SYSTEM_OVERVIEW',
  dateFrom: '',
  dateTo: '',
});

async function createAndGenerate() {
  error.value = null;
  if (!form.title.trim()) {
    error.value = 'Title is required';
    return;
  }

  submitting.value = true;
  try {
    const payload: Record<string, any> = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      type: form.type,
    };
    if (form.dateFrom) payload.dateFrom = new Date(form.dateFrom).toISOString();
    if (form.dateTo) payload.dateTo = new Date(form.dateTo).toISOString();

    const created = await $fetch<CreateReportResponse>(`${config.public.apiBase}/admin/reports`, {
      method: 'POST',
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
      body: payload,
    });

    await $fetch<ReportDetailResponse>(`${config.public.apiBase}/admin/reports/${created.id}/generate`, {
      method: 'POST',
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    });

    await router.push(`/admin/reports/${created.id}`);
  } catch (e: any) {
    console.error('Create/generate report failed', e);
    error.value = e?.data?.message || 'Failed to generate report';
  } finally {
    submitting.value = false;
  }
}
</script>
