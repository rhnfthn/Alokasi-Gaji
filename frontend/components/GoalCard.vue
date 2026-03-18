<template>
  <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between">
      <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ goal.title }}</div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ formatRupiah(goal.savedAmount) }} / {{ formatRupiah(goal.targetAmount) }}
      </div>
    </div>

    <!-- Money Progress Bar -->
    <div class="mt-3 space-y-1">
      <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="moneyProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'"
          :style="{ width: Math.min(moneyProgress, 100) + '%' }"
        />
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ Math.round(moneyProgress) }}% reached
      </div>
    </div>

    <!-- Deadline Info -->
    <div v-if="goal.deadline" class="mt-3 space-y-1">
      <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Due: {{ formatDate(goal.deadline) }}</span>
        <span v-if="daysLeft !== null">{{ daysLeft }} days left</span>
      </div>

      <div v-if="timeProgress !== null" class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="timeProgress >= 0.9 ? 'bg-red-500' : 'bg-gray-900 dark:bg-gray-100'"
          :style="{ width: (Math.round(timeProgress * 100)) + '%' }"
        />
      </div>
    </div>

    <!-- Add Money Button -->
    <button
      type="button"
      class="mt-3 w-full rounded border border-blue-500 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
      @click="$emit('add-money')"
    >
      + Add Money
    </button>

    <!-- Recent Contributions -->
    <div v-if="goal.contributions && goal.contributions.length" class="mt-4 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-800">
      <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Recent Contributions</div>
      <div v-for="c in goal.contributions.slice(0, 3)" :key="c.id" class="flex items-center justify-between text-xs">
        <span class="text-gray-600 dark:text-gray-400">{{ c.wallet.name }}</span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ formatRupiah(c.amount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Goal } from '~/stores/goalStore';

const props = defineProps<{ goal: Goal }>();
defineEmits<{ 'add-money': [] }>();

const moneyProgress = computed<number>(() => {
  const saved = Number(props.goal.savedAmount ?? 0);
  const target = Number(props.goal.targetAmount ?? 1);
  return target > 0 ? (saved / target) * 100 : 0;
});

const daysLeft = computed<number | null>(() => {
  if (!props.goal.deadline) return null;
  const d = new Date(props.goal.deadline);
  if (Number.isNaN(d.getTime())) return null;
  const diff = d.getTime() - Date.now();
  return Math.ceil(diff / 86400000);
});

const timeProgress = computed<number | null>(() => {
  if (!props.goal.deadline || !props.goal.createdAt) return null;
  const start = new Date(props.goal.createdAt);
  const end = new Date(props.goal.deadline);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 1;
  const elapsed = Date.now() - start.getTime();
  const pct = elapsed / total;
  return Math.max(0, Math.min(1, pct));
});

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}
</script>
