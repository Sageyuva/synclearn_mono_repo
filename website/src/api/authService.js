import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Auth Service — Website App (Teachers & Admins)
 * All authentication-related API calls.
 *
 * Rule: No axios imports in UI components — always use this service.
 */

/**
 * Login a teacher.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginTeacher = async (credentials) => {
    const { data } = await axiosClient.post(API_ROUTES.AUTH.TEACHER_LOGIN, credentials);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, role: 'teacher' }));

    return data;
};

/**
 * Login an admin.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginAdmin = async (credentials) => {
    const { data } = await axiosClient.post(API_ROUTES.AUTH.ADMIN_LOGIN, credentials);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ ...data.user, role: 'admin' }));

    return data;
};

/**
 * Add a new teacher (admin only).
 * Token is auto-attached by the request interceptor.
 * @param {object} teacherData
 */
export const addTeacher = async (teacherData) => {
    const { data } = await axiosClient.post(API_ROUTES.ADMIN.ADD_TEACHER, teacherData);
    return data;
};

/**
 * Add a new student (admin or teacher).
 * @param {object} studentData
 * @param {'admin'|'teacher'} role - Determines which endpoint to use
 */
export const addStudent = async (studentData, role = 'teacher') => {
    const endpoint =
        role === 'admin' ? API_ROUTES.ADMIN.ADD_STUDENT : API_ROUTES.TEACHER.ADD_STUDENT;
    const { data } = await axiosClient.post(endpoint, studentData);
    return data;
};

/**
 * Logout — clears client-side session.
 */
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
