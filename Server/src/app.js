const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const baseUrl = process.env.BASE_URL || "/api/"

// Admin routes: add-admin, login, add-teacher, add-student
const adminRoute = require("./Routes/AdminRoute")
app.use(`${baseUrl}admin`, adminRoute)

// Teacher routes: add-student
const teacherRoute = require("./Routes/TeacherRoute")
app.use(`${baseUrl}teacher`, teacherRoute)

// Global error handler — must be LAST
const errorHandler = require("./Middleware/errorHandler")
app.use(errorHandler)

module.exports = app