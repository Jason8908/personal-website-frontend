export const ROUTES = {
  home: "/",
  admin: {
    dashboard: "/admin",
    login: "/admin/login",
  },
} as const;

export type Routes = typeof ROUTES;
