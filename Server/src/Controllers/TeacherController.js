const addUserService = require("../Services/AddUserService")
const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")

// POST /api/teacher/add-student — teacher only
const addStudentController = asyncHandler(async (req, res) => {
    const { name, email, password, classEnrolled, studentSection, rollNo } = req.body
    const result = await addUserService(name, email, password, "student", { classEnrolled, studentSection, rollNo })
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { addStudentController }
