export type RupiahFormatOptions = {
  prefix?: boolean;
};

export function formatRupiah(value: number | string | null | undefined, options: RupiahFormatOptions = {}) {
  const { prefix = true } = options;

  const num = typeof value === 'string' ? Number(value) : Number(value ?? 0);
  const safe = Number.isFinite(num) ? Math.round(num) : 0;

  const formatted = safe
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return prefix ? `Rp. ${formatted}` : formatted;
}

export function parseRupiah(text: string | null | undefined) {
  if (!text) return 0;
  const digitsOnly = String(text).replace(/[^0-9]/g, '');
  if (!digitsOnly) return 0;
  return Number(digitsOnly);
}

export default function useRupiah() {
  return {
    formatRupiah,
    parseRupiah,
  };
}
