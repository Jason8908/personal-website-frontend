export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
}

export type HttpStatusCode = typeof HTTP_STATUS_CODES[keyof typeof HTTP_STATUS_CODES];

export type ApiResponse<T> = {
  success: boolean;
  statusCode: HttpStatusCode;
  message: string;
  data: T;
  timestamp: string;
};

export const API_ROUTES = {
  auth: {
    login: "/users/login",
    logout: "/users/logout",
  },
  experience: {
    getAll: "/experiences",
    create: "/experiences",
    update: (id: string) => `/experiences/${id}`,
    delete: (id: string) => `/experiences/${id}`,
  },
  project: {
    getAll: "/projects",
    create: "/projects",
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  education: {
    getAll: "/education",
    create: "/education",
    update: (id: string) => `/education/${id}`,
    delete: (id: string) => `/education/${id}`,
  },
  user: {
    me: "/users/me",
  },
} as const;

export type ApiRoutes = typeof API_ROUTES;