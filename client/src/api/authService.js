import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Auth Service — Student App
 * All authentication-related API calls for students.
 *
 * Rule: No axios imports in UI components — always use this service.
 */

/**
 * Login a student.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginStudent = async (credentials) => {
    const { data } = await axiosClient.post(API_ROUTES.AUTH.LOGIN, credentials);

    // Persist session
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
};

/**
 * Fetch logged-in student profile.
 * Token is auto-attached by the request interceptor.
 * @returns {Promise<object>}
 */
export const getStudentProfile = async () => {
    const { data } = await axiosClient.get(API_ROUTES.STUDENTS.PROFILE);
    return data;
};

/**
 * Logout — clears client-side session.
 */
export const logoutStudent = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
