const asyncHandler = require("../Utils/catchAsync")
const { successResponse, errorResponse } = require("../Utils/ResponseUtils")
const { loginStudent } = require("../Services/StudentService")

// POST /api/student/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const result = await loginStudent(email, password)
    if (!result.success) return errorResponse(res, result.statusCode, result.message)
    return successResponse(res, result.statusCode, result.message, result.data)
})

module.exports = { login }
