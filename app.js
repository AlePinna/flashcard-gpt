require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const apiRouter = require("./backend/routes/Routes")
const path = require('path')
const cors = require('cors')

const app = express()
 
app.use(express.json())

module.exports = app

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

app.use(cors())

app.use("/api", apiRouter)

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "index.html"))
})

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})

process.on("uncaughException", error => console.log(error))
process.on('unhandledRejection', error => console.log(error))
