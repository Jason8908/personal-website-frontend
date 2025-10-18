import { getApiClient } from "@/lib/http/apiClient";
import type { Experience } from "@/services/experience/types";
import { API_ROUTES } from "@/lib/http/types";
import type { ApiResponse } from "@/lib/http/types";

export type CreateExperienceRequest = {
  company: string;
  position: string;
  bulletPoints: string[];
  skills: string[];
  startDate: Date | string; // UTC ISO8601
  endDate?: Date | string; // optional UTC ISO8601
};

export const experienceService = {
  async getAllExperiences(): Promise<ApiResponse<Experience[]>> {
    return getApiClient().get<ApiResponse<Experience[]>>(API_ROUTES.experience.getAll);
  },
  async createExperience(payload: CreateExperienceRequest): Promise<ApiResponse<Experience>> {
    const client = getApiClient();
    const body: Record<string, unknown> = {
      company: payload.company,
      position: payload.position,
      bulletPoints: payload.bulletPoints,
      skills: payload.skills,
      startDate: toUtcIsoString(payload.startDate),
    };

    if (payload.endDate != null) {
      body.endDate = toUtcIsoString(payload.endDate);
    }

    return client.post<ApiResponse<Experience>>(API_ROUTES.experience.create, body, {
      credentials: "include",
    });
  },
};

function toUtcIsoString(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date for experience");
  return date.toISOString();
}