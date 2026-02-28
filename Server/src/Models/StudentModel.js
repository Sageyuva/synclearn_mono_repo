const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    class: { type: String, required: true, trim: true },           // e.g. "10A"
    rollNumber: { type: String, required: true, trim: true },       // e.g. "23"
    totalScore: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    level: { type: Number, default: 1 },
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema)
