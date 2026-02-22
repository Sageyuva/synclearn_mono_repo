const express = require("express")
const router = express.Router()
const { addStudentController } = require("../Controllers/TeacherController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Protected: teacher only
router.post("/add-student", authenticate, authorizeRoles("teacher"), addStudentController)

module.exports = router
