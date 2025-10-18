import { getApiClient } from "@/lib/http/apiClient";
import type { Experience } from "@/services/experience/types";
import { API_ROUTES } from "@/lib/http/types";
import type { ApiResponse } from "@/lib/http/types";

export const experienceService = {
  async getAllExperiences(): Promise<ApiResponse<Experience[]>> {
    return getApiClient().get<ApiResponse<Experience[]>>(API_ROUTES.experience.getAll);
  },
};