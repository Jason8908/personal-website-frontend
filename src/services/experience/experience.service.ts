import { getApiClient } from "@/lib/http/apiClient";
import type { Experience } from "@/services/experience/types";
import { API_ROUTES } from "@/lib/http/types";

export const experienceService = {
  async getAllExperiences(): Promise<Experience[]> {
    return getApiClient().get<Experience[]>(API_ROUTES.experience.getAll);
  },
};