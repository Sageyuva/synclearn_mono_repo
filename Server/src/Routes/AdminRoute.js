const express = require("express")
const router = express.Router()
const { registerAdmin, login, createTeacher, createStudent } = require("../Controllers/AdminController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public
router.post("/register", registerAdmin)
router.post("/login", login)

// Admin only
router.post("/add-teacher", authenticate, authorizeRoles("admin"), createTeacher)
router.post("/add-student", authenticate, authorizeRoles("admin"), createStudent)

module.exports = router