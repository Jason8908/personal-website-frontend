type Env = {
  apiBaseUrl: string;
  nodeEnv: "development" | "test" | "production";
};

function readEnv(): Env {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const nodeEnv = (process.env.NODE_ENV || "development") as Env["nodeEnv"];

  if (!apiBaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL env var."
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(apiBaseUrl);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_API_BASE_URL. Expected absolute URL, got: ${apiBaseUrl}`
    );
  }

  return { apiBaseUrl, nodeEnv };
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;
  cachedEnv = readEnv();
  return cachedEnv;
}

export type { Env };
