import { getApiClient } from "@/lib/http/apiClient";
import type { Experience } from "@/services/experience/types";

export const experienceService = {
  async getAllExperiences(): Promise<Experience[]> {
    return getApiClient().get<Experience[]>(`/experiences`);
  },
};