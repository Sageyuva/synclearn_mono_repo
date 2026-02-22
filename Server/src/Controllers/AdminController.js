const addAdminService = require("../Services/AddAdminService")
const addUserService = require("../Services/AddUserService")
const loginService = require("../Services/LoginService")
const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")

// POST /api/admin/add-admin — open bootstrap endpoint, no auth required
const addAdminController = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const result = await addAdminService(name, email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/admin/login — open endpoint for all roles
const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await loginService(email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/admin/add-teacher — admin only
const addTeacherController = asyncHandler(async (req, res) => {
    const { name, email, password, classAssigned, subject, section } = req.body
    const result = await addUserService(name, email, password, "teacher", { classAssigned, subject, section })
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

// POST /api/admin/add-student — admin only
const addStudentController = asyncHandler(async (req, res) => {
    const { name, email, password, classEnrolled, studentSection, rollNo } = req.body
    const result = await addUserService(name, email, password, "student", { classEnrolled, studentSection, rollNo })
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { addAdminController, loginController, addTeacherController, addStudentController }