//configure dotenv
const dotenv = require("dotenv")
dotenv.config()
const PORT = process.env.PORT || 8000
//import app and dbConfig
const app = require("./src/app")
const connectDB = require("./src/Config/dbConfig")
connectDB()
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))