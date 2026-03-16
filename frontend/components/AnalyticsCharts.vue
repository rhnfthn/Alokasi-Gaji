<template>
  <div class="grid gap-4 md:grid-cols-2">
    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Spending by Category</div>
      <Doughnut v-if="spendingData" :data="spendingData" :options="doughnutOptions" />
      <div v-else class="text-sm text-gray-500 dark:text-gray-400">No data</div>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Income vs Expense</div>
      <Bar v-if="incomeExpenseData" :data="incomeExpenseData" :options="barOptions" />
      <div v-else class="text-sm text-gray-500 dark:text-gray-400">No data</div>
    </div>

    <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:col-span-2">
      <div class="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Trend (Expense)</div>
      <Line v-if="trendData" :data="trendData" :options="lineOptions" />
      <div v-else class="text-sm text-gray-500 dark:text-gray-400">No data</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'vue-chartjs';
import type { CategorySpend, IncomeExpensePoint, TrendPoint } from '~/stores/analyticsStore';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

const props = defineProps<{
  spendingByCategory: CategorySpend[];
  incomeExpense: IncomeExpensePoint[];
  monthlyTrend: TrendPoint[];
}>();

function readTailwindTextColor(twClass: string) {
  if (!import.meta.client) return '';
  const el = document.createElement('span');
  el.className = twClass;
  el.style.position = 'absolute';
  el.style.opacity = '0';
  document.body.appendChild(el);
  const color = getComputedStyle(el).color;
  el.remove();
  return color;
}

function withAlpha(color: string, alpha: number) {
  const m = color.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/i);
  if (!m) return color;
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
}

const palette = ref<string[]>([]);
const paletteBg = computed(() => palette.value.map((c) => withAlpha(c, 0.28)));
const isDark = ref(false);

onMounted(() => {
  const classes = [
    'text-emerald-500',
    'text-sky-500',
    'text-violet-500',
    'text-amber-500',
    'text-rose-500',
    'text-teal-500',
    'text-indigo-500',
    'text-lime-500',
  ];
  palette.value = classes.map(readTailwindTextColor).filter(Boolean);

  // Check dark mode
  if (import.meta.client) {
    isDark.value = document.documentElement.classList.contains('dark');
    // Watch for dark mode changes
    const observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
});

const spendingData = computed<ChartData<'doughnut'> | null>(() => {
  if (!props.spendingByCategory?.length) return null;
  const colors = palette.value.length ? palette.value : [];

  return {
    labels: props.spendingByCategory.map((x) => x.category),
    datasets: [
      {
        label: 'Spending',
        data: props.spendingByCategory.map((x) => Number(x.amount)),
        backgroundColor: colors.length ? (colors.slice(0, props.spendingByCategory.length) as any) : undefined,
        borderColor: 'transparent',
        hoverOffset: 6,
      },
    ],
  };
});

const incomeExpenseData = computed<ChartData<'bar'> | null>(() => {
  if (!props.incomeExpense?.length) return null;
  const labels = props.incomeExpense.map((p) => `${p.month}/${p.year}`);

  const incomeColor = palette.value[0];
  const expenseColor = palette.value[4] ?? palette.value[1];

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: props.incomeExpense.map((p) => Number(p.income)),
        backgroundColor: incomeColor ? withAlpha(incomeColor, 0.35) : undefined,
        borderColor: incomeColor || undefined,
        borderWidth: 1,
        borderRadius: 10,
      },
      {
        label: 'Expense',
        data: props.incomeExpense.map((p) => Number(p.expense)),
        backgroundColor: expenseColor ? withAlpha(expenseColor, 0.35) : undefined,
        borderColor: expenseColor || undefined,
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };
});

const trendData = computed<ChartData<'line'> | null>(() => {
  if (!props.monthlyTrend?.length) return null;
  const labels = props.monthlyTrend.map((p) => `${p.month}/${p.year}`);

  const lineColor = palette.value[4] ?? palette.value[0];

  return {
    labels,
    datasets: [
      {
        label: 'Expense',
        data: props.monthlyTrend.map((p) => Number(p.expense)),
        fill: true,
        borderColor: lineColor || undefined,
        backgroundColor: lineColor ? withAlpha(lineColor, 0.14) : undefined,
        pointRadius: 3,
        pointHoverRadius: 5,
        tension: 0.35,
      },
    ],
  };
});

const doughnutOptions = computed<ChartOptions<'doughnut'>>(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
        color: isDark.value ? '#e5e7eb' : '#374151'
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const value = Number(ctx.parsed);
          return `${ctx.label}: ${formatRupiah(value)}`;
        },
      },
    },
  },
}));

const barOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
        color: isDark.value ? '#e5e7eb' : '#374151'
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(Number(ctx.parsed.y))}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (v) => formatRupiah(Number(v)),
        color: isDark.value ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280'
      }
    },
  },
}));

const lineOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
        color: isDark.value ? '#e5e7eb' : '#374151'
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(Number(ctx.parsed.y))}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (v) => formatRupiah(Number(v)),
        color: isDark.value ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: isDark.value ? '#374151' : '#e5e7eb'
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280'
      }
    },
  },
}));
</script>
