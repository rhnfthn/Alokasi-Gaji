export function resolveApiUrl(url: string | null | undefined) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;

  const base = useRuntimeConfig().public.apiBase;
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}
