const express = require("express")
const router = express.Router()
const { login } = require("../Controllers/StudentController")

// Public
router.post("/login", login)

module.exports = router
