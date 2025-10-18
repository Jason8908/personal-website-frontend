import { getApiClient } from "@/lib/http/apiClient";
import type { ApiResponse } from "@/lib/http/types";
import { API_ROUTES } from "@/lib/http/types";
import type { Education } from "@/services/education/types";

export const educationService = {
  async getAllEducation(): Promise<ApiResponse<Education[]>> {
    return getApiClient().get<ApiResponse<Education[]>>(API_ROUTES.education.getAll);
  },
};