require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const flashcardRouter = require("./routes/Routes")
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

app.use('/', express.static(path.join(__dirname, 'static')))
app.use("/api", flashcardRouter)

app.listen(3001, () => {
  console.log("Server is running on port 3001")
})
 
