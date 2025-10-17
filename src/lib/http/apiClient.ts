import { HttpClient } from "@/lib/http/httpClient";

let singleton: HttpClient | null = null;

export function getApiClient(): HttpClient {
  if (singleton) return singleton;
  singleton = new HttpClient();
  return singleton;
}