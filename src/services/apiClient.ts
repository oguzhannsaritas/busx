const RAW_BASE = (import.meta.env.VITE_API_BASE ?? "/api").trim();
const BASE = RAW_BASE.replace(/\/+$/, "");


const inflight = new Map<string, Promise<any>>();

const cache = new Map<string, { t: number; data: any }>();
const DEFAULT_TTL = 10_000;

function toUrl(path: string) {

    if (/^https?:\/\//i.test(path)) return path;
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${BASE}${p}`;
}

export async function apiGet<T>(
    path: string,
    opts: { signal?: AbortSignal; cacheTtl?: number } = {}
): Promise<T> {
    const url = toUrl(path);
    const ttl = opts.cacheTtl ?? DEFAULT_TTL;
    const now = Date.now();

    const hit = cache.get(url);
    if (hit && now - hit.t < ttl) return hit.data as T;

    const same = inflight.get(url);
    if (same) return same as Promise<T>;

    const p = fetch(url, { signal: opts.signal })
        .then((r) => {
            if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`);
            return r.json();
        })
        .then((data) => {
            cache.set(url, { t: Date.now(), data });
            return data as T;
        })
        .finally(() => inflight.delete(url));

    inflight.set(url, p);
    return p;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    const url = toUrl(path);
    const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`POST ${url} -> ${r.status}`);
    return r.json();
}
