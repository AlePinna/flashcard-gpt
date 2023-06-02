const bcrypt = require("bcrypt")
const UserModel = require("../models/User")

exports.createUser = async (username, password) => {
    
  if (!username || !password || username.trim().length < 8 || password.trim().length < 8) {
    let err = new Error("Username and password should contain at least 8 characters")
    err.status = 400
    throw err
  }

  if (await UserModel.exists({ username: username.trim() })) {
    let err = new Error("This username is already taken")
    err.status = 400
    throw err
  }

  const hashedPassword = await bcrypt.hash(password.trim(), await bcrypt.genSalt(10))

  await UserModel.create({ username: username.trim(), password: hashedPassword })
}

exports.authenticateUser = async (username, password) => {
    
  if (!username || !password) {
    let err = new Error("Username and password cannot be empty")
    err.status = 400
    throw err
  }

  const user = await UserModel.findOne({ username: username.trim() })

  if (!user) {
    return false
  }

  const salt = user.password.slice(0, 29)
  const hashedPassword = await bcrypt.hash(password.trim(), salt)

  return hashedPassword === user.password
}