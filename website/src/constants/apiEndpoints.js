/**
 * API_ROUTES — Single source of truth for all API endpoint paths.
 * These are relative paths that compose with VITE_API_URL in axiosClient.
 *
 * NOTE: No leading slash — VITE_API_URL already ends with '/'.
 * NOTE: Route names are SINGULAR to match Express mount points on the server:
 *       app.use(`${baseUrl}teacher`, ...) → /api/teacher/login
 */
export const API_ROUTES = Object.freeze({
    AUTH: Object.freeze({
        TEACHER_LOGIN: 'teacher/login',
        ADMIN_LOGIN: 'admin/login',
        ADMIN_REGISTER: 'admin/register',
    }),

    ADMIN: Object.freeze({
        ADD_TEACHER: 'admin/add-teacher',
        ADD_STUDENT: 'admin/add-student',
    }),

    TEACHER: Object.freeze({
        ADD_STUDENT: 'teacher/add-student',
    }),
});
