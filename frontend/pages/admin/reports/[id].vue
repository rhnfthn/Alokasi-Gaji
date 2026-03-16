<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ report?.title || 'Report' }}</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ report ? `${formatType(report.type)} • ${report.status}` : 'Loading...' }}
          </p>
        </div>

        <div class="flex gap-3">
          <NuxtLink
            to="/admin/reports"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            Back
          </NuxtLink>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="generate"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Generate
          </button>
        </div>
      </div>

      <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        {{ error }}
      </div>

      <div v-if="loading" class="text-sm text-gray-500 dark:text-gray-400">Loading report...</div>

      <div v-else-if="report" class="space-y-4">
        <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</p>
              <p class="mt-1 font-semibold text-gray-900 dark:text-white">{{ formatType(report.type) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Created</p>
              <p class="mt-1 font-semibold text-gray-900 dark:text-white">{{ formatDate(report.createdAt) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Generated</p>
              <p class="mt-1 font-semibold text-gray-900 dark:text-white">{{ report.generatedAt ? formatDate(report.generatedAt) : '-' }}</p>
            </div>
          </div>

          <div v-if="report.description" class="mt-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</p>
            <p class="mt-1 text-sm text-gray-700 dark:text-gray-200">{{ report.description }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Result (Aggregated)</h2>
            <span class="text-xs text-gray-500 dark:text-gray-400">No transaction-level data is shown</span>
          </div>

          <pre class="overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">{{ formattedResult }}</pre>
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
type ReportStatus = 'DRAFT' | 'GENERATED' | 'FAILED';

type ReportDetail = {
  id: string;
  title: string;
  description?: string | null;
  type: ReportType;
  status: ReportStatus;
  result?: any;
  createdAt: string;
  generatedAt?: string | null;
};

const config = useRuntimeConfig();
const token = useCookie('access_token');

const route = useRoute();
const id = computed(() => String(route.params.id));

const loading = ref(true);
const report = ref<ReportDetail | null>(null);
const error = ref<string | null>(null);

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function formatType(type: ReportType) {
  if (type === 'SYSTEM_OVERVIEW') return 'System Overview';
  if (type === 'SUPPORT_OVERVIEW') return 'Support Overview';
  return 'Finance Overview';
}

const formattedResult = computed(() => {
  if (!report.value?.result) return 'No result yet';
  try {
    return JSON.stringify(report.value.result, null, 2);
  } catch {
    return String(report.value.result);
  }
});

async function fetchReport() {
  loading.value = true;
  error.value = null;
  try {
    const data = await $fetch<ReportDetail>(`${config.public.apiBase}/admin/reports/${id.value}`, {
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    });
    report.value = data;
  } catch (e: any) {
    console.error('Failed to fetch report', e);
    error.value = e?.data?.message || 'Failed to load report';
    report.value = null;
  } finally {
    loading.value = false;
  }
}

async function generate() {
  loading.value = true;
  error.value = null;
  try {
    await $fetch(`${config.public.apiBase}/admin/reports/${id.value}/generate`, {
      method: 'POST',
      headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    });
    await fetchReport();
  } catch (e: any) {
    console.error('Generate failed', e);
    error.value = e?.data?.message || 'Failed to generate report';
    loading.value = false;
  }
}

onMounted(fetchReport);
</script>
