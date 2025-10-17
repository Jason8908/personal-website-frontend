import { getEnv } from "@/lib/config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type NextOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export type HttpClientOptions = {
  headers?: Record<string, string>;
  next?: NextOptions;
  fetchImpl?: typeof fetch;
};

export type JsonBody = Record<string, unknown> | unknown[] | null;

export class HttpError extends Error {
  status: number;
  url: string;
  body: unknown;

  constructor(message: string, status: number, url: string, body: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options?: { baseUrl?: string; fetchImpl?: typeof fetch }) {
    const env = getEnv();
    this.baseUrl = options?.baseUrl ?? env.apiBaseUrl;
    this.fetchImpl = options?.fetchImpl ?? fetch;
  }

  async request<T>(
    path: string,
    method: HttpMethod,
    body?: JsonBody,
    options?: HttpClientOptions
  ): Promise<T> {
    const url = this.composeUrl(path);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    };

    const response = await this.fetchImpl(url, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
      next: options?.next,
    });

    const text = await response.text();
    const isJson = (response.headers.get("content-type") || "").includes(
      "application/json"
    );
    const parsed = text && isJson ? safeParseJson(text) : text || null;

    if (!response.ok) {
      throw new HttpError(
        `HTTP ${response.status} for ${method} ${url}`,
        response.status,
        url,
        parsed
      );
    }

    return parsed as T;
  }

  get<T>(path: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(path, "GET", undefined, options);
  }

  post<T>(path: string, body?: JsonBody, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(path, "POST", body ?? null, options);
  }

  put<T>(path: string, body?: JsonBody, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(path, "PUT", body ?? null, options);
  }

  patch<T>(
    path: string,
    body?: JsonBody,
    options?: HttpClientOptions
  ): Promise<T> {
    return this.request<T>(path, "PATCH", body ?? null, options);
  }

  delete<T>(path: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>(path, "DELETE", undefined, options);
  }

  private composeUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    const base = this.baseUrl.replace(/\/$/, "");
    const p = path.replace(/^\//, "");
    return `${base}/${p}`;
  }
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}


