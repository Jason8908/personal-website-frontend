import { getApiClient } from "@/lib/http";
import type { ApiResponse } from "@/lib/http/types";
import { API_ROUTES } from "@/lib/http/types";

export type LoginRequest = {
  email: string;
  password: string;
};

export async function login(request: LoginRequest): Promise<ApiResponse<null>> {
  const client = getApiClient();
  const res = await client.post<ApiResponse<null>>(API_ROUTES.auth.login, request, {
    credentials: "include"
  });
  return res;
}

export async function logout(): Promise<ApiResponse<null>> {
  const client = getApiClient();
  const res = await client.delete<ApiResponse<null>>(API_ROUTES.auth.logout, {
    credentials: "include",
  });
  return res;
}

export const authService = { login, logout };
