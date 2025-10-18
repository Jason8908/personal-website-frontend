import { getApiClient } from "@/lib/http/apiClient";
import type { ApiResponse } from "@/lib/http/types";
import { API_ROUTES } from "@/lib/http/types";
import type { Project } from "@/services/project/types";

export const projectService = {
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return getApiClient().get<ApiResponse<Project[]>>(API_ROUTES.project.getAll);
  },
};