/**
 * Shared server-side fetch helper: timeout, one retry on network/5xx errors,
 * a generic User-Agent (never personal details) and Next.js data caching.
 */

export const USER_AGENT = 'VirtualArtGallery/0.1 (open-source educational app)';

/** Default cache lifetime for upstream responses, in seconds. */
export const REVALIDATE_SECONDS = 60 * 60 * 6;

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class TimeoutError extends Error {
  constructor(url: string, ms: number) {
    super(`Timed out after ${ms} ms: ${new URL(url).host}`);
    this.name = 'TimeoutError';
  }
}

export interface FetchJsonOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  revalidate?: number;
  retries?: number;
}

export async function fetchJson<T>(url: string, opts: FetchJsonOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, timeoutMs = 6000, revalidate = REVALIDATE_SECONDS, retries = 1 } = opts;
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        // Next.js data cache: identical upstream requests are served from cache.
        next: { revalidate },
      } as RequestInit);
      if (!res.ok) {
        const err = new HttpError(`${new URL(url).host} responded ${res.status}`, res.status);
        if (res.status >= 500 || res.status === 429) {
          lastError = err;
          continue;
        }
        throw err;
      }
      return (await res.json()) as T;
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        lastError = new TimeoutError(url, timeoutMs);
        break; // don't retry timeouts: the function budget is limited
      }
      if (e instanceof HttpError && e.status < 500 && e.status !== 429) throw e;
      lastError = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

/** Build a URL with query params, skipping null/undefined/empty values. */
export function buildUrl(base: string, params: Record<string, string | number | boolean | null | undefined | string[]>): string {
  const url = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined || v === '') continue;
    if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(k, item));
    else url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export function stripHtml(html: string | null | undefined): string | null {
  if (!html) return null;
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return text || null;
}

/** Parse a plausible year (supports "ca. 1780", "1850s", "500 BCE", "19th century"). */
export function parseYear(text: string | null | undefined): number | null {
  if (!text) return null;
  const t = text.toLowerCase();
  const bce = /\b(bce|b\.c\.e?\.?|bc)\b/.test(t);
  const century = t.match(/(\d{1,2})(st|nd|rd|th)\s+century/);
  if (century) {
    const n = Number(century[1]);
    return bce ? -n * 100 : (n - 1) * 100;
  }
  const m = t.match(/\d{3,4}/);
  if (!m) return null;
  const y = Number(m[0]);
  return bce ? -y : y;
}
