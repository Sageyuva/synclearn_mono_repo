const express = require("express")
const router = express.Router()
const { registerAdmin, login, createTeacher, createStudent, listTeachers, listStudents } = require("../Controllers/AdminController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public
router.post("/register", registerAdmin)
router.post("/login", login)

// Admin only — create
router.post("/add-teacher", authenticate, authorizeRoles("admin"), createTeacher)
router.post("/add-student", authenticate, authorizeRoles("admin"), createStudent)

// Admin only — list
router.get("/teachers", authenticate, authorizeRoles("admin"), listTeachers)
router.get("/students", authenticate, authorizeRoles("admin"), listStudents)

module.exports = router