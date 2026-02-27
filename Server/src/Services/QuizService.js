const QuizModel = require("../Models/QuizModel")
const QuizAttemptModel = require("../Models/QuizAttemptModel")
const StudentModel = require("../Models/StudentModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Create quiz for a lesson
const createQuiz = async (lessonId, questions) => {
    const existing = await QuizModel.findOne({ lessonId })
    if (existing) return serviceFail(409, "A quiz already exists for this lesson")
    if (!questions || questions.length !== 5) {
        return serviceFail(400, "A quiz must have exactly 5 questions")
    }
    const quiz = await QuizModel.create({ lessonId, questions })
    return serviceOk("Quiz created successfully", quiz, 201)
}

// Get quiz by lesson ID (strip correctAns for students)
const getQuizByLesson = async (lessonId, role) => {
    const quiz = await QuizModel.findOne({ lessonId })
    if (!quiz) return serviceFail(404, "No quiz found for this lesson")

    // Students must not see the correct answers
    if (role === "student") {
        const sanitized = {
            _id: quiz._id,
            lessonId: quiz.lessonId,
            questions: quiz.questions.map(q => ({
                questionText: q.questionText,
                options: q.options,
            })),
        }
        return serviceOk("Quiz fetched", sanitized)
    }
    return serviceOk("Quiz fetched", quiz)
}

// Submit quiz attempt — auto-calculate score and update student totalScore
const submitQuiz = async (quizId, studentId, answers) => {
    const quiz = await QuizModel.findById(quizId)
    if (!quiz) return serviceFail(404, "Quiz not found")
    if (!answers || answers.length !== quiz.questions.length) {
        return serviceFail(400, "Please answer all questions before submitting")
    }

    // Calculate score
    const score = quiz.questions.reduce((acc, q, i) => {
        return acc + (answers[i] === q.correctAns ? 1 : 0)
    }, 0)

    // Save attempt
    const attempt = await QuizAttemptModel.create({ quizId, studentId, answers, score })

    // Increment student totalScore
    await StudentModel.findByIdAndUpdate(studentId, { $inc: { totalScore: score } })

    return serviceOk("Quiz submitted", { score, total: quiz.questions.length, attemptId: attempt._id }, 201)
}

// Delete quiz (teacher owner or admin)
const deleteQuiz = async (id, userId, role) => {
    const quiz = await QuizModel.findById(id).populate("lessonId", "teacherId")
    if (!quiz) return serviceFail(404, "Quiz not found")
    if (role !== "admin" && quiz.lessonId.teacherId.toString() !== userId) {
        return serviceFail(403, "You can only delete quizzes linked to your own lessons")
    }
    await QuizModel.findByIdAndDelete(id)
    return serviceOk("Quiz deleted")
}

module.exports = { createQuiz, getQuizByLesson, submitQuiz, deleteQuiz }
