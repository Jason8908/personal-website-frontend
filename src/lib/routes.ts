export const ROUTES = {
  home: "/",
  admin: {
    dashboard: "/admin",
    login: "/admin/login",
    experiences: "/admin/experiences",
    projects: "/admin/projects",
    education: "/admin/education",
  },
} as const;

export type Routes = typeof ROUTES;
