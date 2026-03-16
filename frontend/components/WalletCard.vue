<template>
  <div class="rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-start justify-between">
      <div>
        <div class="text-sm text-gray-500 dark:text-gray-400">{{ wallet.type }}</div>
        <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ wallet.name }}</div>
      </div>
      <div class="text-right">
        <div class="text-sm text-gray-500 dark:text-gray-400">Balance</div>
        <div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ formatRupiah(wallet.balance) }} {{ wallet.currency }}</div>
      </div>
    </div>
    <div v-if="actions" class="mt-3 flex gap-2">
      <button
        class="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
        type="button"
        @click="actions.onEdit(wallet.id)"
      >
        Edit
      </button>
      <button
        class="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
        type="button"
        @click="actions.onDelete(wallet.id)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wallet } from '~/stores/walletStore';

defineProps<{ wallet: Wallet; actions?: { onEdit: (id: string) => void; onDelete: (id: string) => void } }>();
</script>

