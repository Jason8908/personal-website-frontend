import { getApiClient } from "@/lib/http/apiClient";
import { API_ROUTES } from "@/lib/http/types";
import type { ApiResponse } from "@/lib/http/types";
import type { User } from "@/services/user/types";

async function getCurrentUser(): Promise<ApiResponse<User>> {
  const client = getApiClient();
  return client.get<ApiResponse<User>>(API_ROUTES.user.me, { credentials: "include" });
}

export const userService = { getCurrentUser };
