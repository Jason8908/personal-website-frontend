import { getApiClient } from "@/lib/http/apiClient";
import type { ApiResponse } from "@/lib/http/types";
import { API_ROUTES } from "@/lib/http/types";
import type { Education } from "@/services/education/types";

export const educationService = {
  async getAllEducation(): Promise<ApiResponse<Education[]>> {
    return getApiClient().get<ApiResponse<Education[]>>(API_ROUTES.education.getAll);
  },
  async createEducation(payload: CreateEducationRequest): Promise<ApiResponse<Education>> {
    const client = getApiClient();
    const body = {
      school: payload.school,
      degree: payload.degree,
      fieldOfStudy: payload.fieldOfStudy,
      description: payload.description,
      startDate: toUtcIsoString(payload.startDate),
      endDate: toUtcIsoString(payload.endDate),
    };
    return client.post<ApiResponse<Education>>(API_ROUTES.education.create, body, { credentials: "include" });
  },
};

export type CreateEducationRequest = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
};

function toUtcIsoString(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid date for education");
  return date.toISOString();
}