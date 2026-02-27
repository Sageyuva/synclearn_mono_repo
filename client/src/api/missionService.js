import axiosClient from './axiosClient';
import { API_ROUTES } from '../constants/apiEndpoints';

/**
 * Mission Service — Student App
 * Handles all lesson, quiz, and announcement API calls.
 * No axios imports in UI components — always use this service.
 */

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const getAllLessons = async () => {
    const { data } = await axiosClient.get(API_ROUTES.LESSONS.BASE);
    return data;
};

export const getLessonById = async (id) => {
    const { data } = await axiosClient.get(API_ROUTES.LESSONS.BY_ID(id));
    return data;
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────

/** Fetch quiz for a lesson — correctAns stripped by server for students */
export const getQuizForLesson = async (lessonId) => {
    const { data } = await axiosClient.get(API_ROUTES.QUIZ.BY_LESSON(lessonId));
    return data;
};

/** Submit answers array [0-indexed options] for a quiz */
export const submitQuiz = async (quizId, answers) => {
    const { data } = await axiosClient.post(API_ROUTES.QUIZ.SUBMIT(quizId), { answers });
    return data;
};

// ─── Announcements ────────────────────────────────────────────────────────────

export const getAnnouncements = async () => {
    const { data } = await axiosClient.get(API_ROUTES.ANNOUNCEMENTS.BASE);
    return data;
};
