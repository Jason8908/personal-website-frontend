export const ROUTES = {
  admin: {
    login: "/admin/login",
    dashboard: "/admin/dashboard",
  },
} as const;

export type Routes = typeof ROUTES;


