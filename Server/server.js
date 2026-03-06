//configure dotenv
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 8000
//import app and dbConfig
const app = require("./src/app")
const connectDB = require("./src/Config/dbConfig")
const http = require("http")
const { Server } = require("socket.io")
const initializeSocket = require("./src/socket/quizSocket")

connectDB()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
})

initializeSocket(io)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))