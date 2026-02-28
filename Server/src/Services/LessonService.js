const LessonModel = require("../Models/LessonModel")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

// Create a new lesson
const createLesson = async (title, content, category, teacherId, isPublished = false) => {
    const lesson = await LessonModel.create({ title, content, category, teacherId, isPublished })
    return serviceOk("Lesson created successfully", lesson, 201)
}

// Get all active lessons (populate teacher name)
const getAllLessons = async (role) => {
    const filter = { isActive: true }
    if (role === "student") {
        filter.isPublished = true
    }
    const lessons = await LessonModel.find(filter)
        .populate("teacherId", "name subject")
        .sort({ createdAt: -1 })
    return serviceOk("Lessons fetched", lessons)
}

// Get single lesson by ID
const getLessonById = async (id, role) => {
    const filter = { _id: id }
    if (role === "student") {
        filter.isPublished = true
        filter.isActive = true
    }
    const lesson = await LessonModel.findOne(filter).populate("teacherId", "name subject")
    if (!lesson) return serviceFail(404, "Lesson not found or unavailable")
    return serviceOk("Lesson fetched", lesson)
}

// Update lesson — only the teacher who created it or admin
const updateLesson = async (id, userId, role, updates) => {
    const lesson = await LessonModel.findById(id)
    if (!lesson) return serviceFail(404, "Lesson not found")
    if (role !== "admin" && lesson.teacherId.toString() !== userId) {
        return serviceFail(403, "You can only edit your own lessons")
    }
    const updated = await LessonModel.findByIdAndUpdate(id, updates, { new: true })
    return serviceOk("Lesson updated", updated)
}

// Delete lesson
const deleteLesson = async (id, userId, role) => {
    const lesson = await LessonModel.findById(id)
    if (!lesson) return serviceFail(404, "Lesson not found")
    if (role !== "admin" && lesson.teacherId.toString() !== userId) {
        return serviceFail(403, "You can only delete your own lessons")
    }
    await LessonModel.findByIdAndDelete(id)
    return serviceOk("Lesson deleted")
}

module.exports = { createLesson, getAllLessons, getLessonById, updateLesson, deleteLesson }
