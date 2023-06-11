const bcrypt = require("bcrypt")
const UserModel = require("../models/User")
const DeckModel = require("../models/Deck")

exports.createUser = async (username, password) => {
    
  if (!username || !password || username.trim().length < 8 || password.trim().length < 8) {
    const err = new Error("Username and password should contain at least 8 characters")
    err.status = 400
    throw err
  }

  if (await UserModel.exists({ username: username.trim() })) {
    const err = new Error("This username is already taken")
    err.status = 400
    throw err
  }

  const hashedPassword = await bcrypt.hash(password.trim(), await bcrypt.genSalt(10))

  await UserModel.create({ username: username.trim(), password: hashedPassword })
}

exports.authenticateUser = async (username, password) => {
    
  if (!username || !password) {
    const err = new Error("Username and password cannot be blank")
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

exports.deleteUser = async (username) => {

  if (!username) {
    throw new Error("Could not retrieve username from token")
  }
    
  await Promise.all([
    UserModel.deleteOne({ username: username.trim() }),
    DeckModel.deleteMany({ username: username.trim() })
  ])
}