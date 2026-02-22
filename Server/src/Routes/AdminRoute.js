const express = require("express")
const router = express.Router()
const { addAdminController, loginController, addTeacherController, addStudentController } = require("../Controllers/AdminController")
const { authenticate, authorizeRoles } = require("../Middleware/authMiddleware")

// Public routes (no auth)
router.post("/add-admin", addAdminController)
router.post("/login", loginController)

// Protected: admin only
router.post("/add-teacher", authenticate, authorizeRoles("admin"), addTeacherController)
router.post("/add-student", authenticate, authorizeRoles("admin"), addStudentController)

module.exports = router