const StudentModel = require("../Models/StudentModel")
const { hashPassword, comparePassword } = require("../Utils/passwordUtils")
const { generateToken } = require("../Utils/JwtUtils")
const { serviceOk, serviceFail } = require("../Utils/ResponseUtils")

const addStudent = async (name, email, password, studentClass, rollNumber) => {
    const existing = await StudentModel.findOne({ email })
    if (existing) return serviceFail(409, "Student with this email already exists")
    const hashed = await hashPassword(password)
    const student = await StudentModel.create({ name, email, password: hashed, class: studentClass, rollNumber })
    return serviceOk("Student created successfully", {
        id: student._id, name: student.name, email: student.email,
        class: student.class, rollNumber: student.rollNumber, totalScore: student.totalScore, role: "student"
    }, 201)
}

const loginStudent = async (email, password) => {
    const student = await StudentModel.findOne({ email }).select("+password")
    if (!student) return serviceFail(404, "Student not found")
    const isMatch = await comparePassword(password, student.password)
    if (!isMatch) return serviceFail(401, "Invalid credentials")
    const token = generateToken({ _id: student._id, role: "student" })
    return serviceOk("Login successful", {
        token,
        user: { id: student._id, name: student.name, email: student.email, class: student.class, rollNumber: student.rollNumber, totalScore: student.totalScore, role: "student" }
    })
}

module.exports = { addStudent, loginStudent }
