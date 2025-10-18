import { getApiClient } from "@/lib/http/apiClient";
import type { ApiResponse } from "@/lib/http/types";
import { API_ROUTES } from "@/lib/http/types";
import type { Project } from "@/services/project/types";

export const projectService = {
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return getApiClient().get<ApiResponse<Project[]>>(API_ROUTES.project.getAll);
  },
  async createProject(payload: CreateProjectRequest): Promise<ApiResponse<Project>> {
    const client = getApiClient();
    const body: Record<string, unknown> = {
      name: payload.name,
      description: payload.description,
      skills: payload.skills,
    };
    if (payload.githubUrl) body.githubUrl = payload.githubUrl;
    if (payload.websiteUrl) body.websiteUrl = payload.websiteUrl;
    if (payload.imageUrl) body.imageUrl = payload.imageUrl;
    return client.post<ApiResponse<Project>>(API_ROUTES.project.create, body, { credentials: "include" });
  },
  async updateProject(id: string, changes: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    const client = getApiClient();
    const body: Record<string, unknown> = {};
    if (changes.name !== undefined) body.name = changes.name;
    if (changes.description !== undefined) body.description = changes.description;
    if (changes.skills !== undefined) body.skills = changes.skills;
    if (changes.githubUrl !== undefined) body.githubUrl = changes.githubUrl;
    if (changes.websiteUrl !== undefined) body.websiteUrl = changes.websiteUrl;
    if (changes.imageUrl !== undefined) body.imageUrl = changes.imageUrl;
    return client.patch<ApiResponse<Project>>(API_ROUTES.project.update(id), body, { credentials: "include" });
  },
};

export type CreateProjectRequest = {
  name: string;
  description: string;
  skills: string[];
  githubUrl?: string;
  websiteUrl?: string;
  imageUrl?: string;
};

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
  skills?: string[];
  githubUrl?: string | null;
  websiteUrl?: string | null;
  imageUrl?: string | null;
};