const mongoose = require("mongoose")
const Schema = mongoose.Schema
 
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  password: String
})
 
module.exports = mongoose.model("User", userSchema)