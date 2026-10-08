const localBackendHosts = new Set(["localhost", "127.0.0.1", "backend", "host.docker.internal"]);

/** Resolve uploaded images using the public API origin, including during SSR. */
export function resolveUploadImageUrl(value?: string | null): string | null {
  const source = value?.trim().replace(/\\/g, "/").replace(/^(?:undefined|null)\/(uploads\/)/i, "/$1");
  if (!source) return null;
  const apiBase = `${(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "")}/`;

  if (/^https?:\/\//i.test(source)) {
    try {
      const parsed = new URL(source);
      const api = new URL(apiBase);
      if (parsed.pathname.startsWith("/uploads/") && (localBackendHosts.has(parsed.hostname.toLowerCase()) || parsed.origin === api.origin)) {
        return new URL(`${parsed.pathname}${parsed.search}`, apiBase).toString();
      }
    } catch {
      return null;
    }
    return null;
  }
  if (/^\/?(?:public\/)?uploads\//i.test(source)) {
    return new URL(`/${source.replace(/^\/?public\//i, "").replace(/^\//, "")}`, apiBase).toString();
  }
  return null;
}

export function resolveImageUrl(value: string): string {
  return resolveUploadImageUrl(value) || value;
}
