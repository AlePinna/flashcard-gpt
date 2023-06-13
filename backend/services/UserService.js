const bcrypt = require("bcrypt")
const UserModel = require("../models/User")
const DeckModel = require("../models/Deck")

exports.createUser = async (username, password) => {

  if ((username?.trim()?.length || 0) < 4) {
    throwBadRequest("Username should contain at least 4 characters")
  }

  if ((password?.trim()?.length || 0) < 8) {
    throwBadRequest("Password should contain at least 8 characters")
  }

  if (await UserModel.exists({ username: username.trim() })) {
    throwBadRequest("This username is already taken")
  }

  const hashedPassword = await bcrypt.hash(password.trim(), await bcrypt.genSalt(10))

  await UserModel.create({ username: username.trim(), password: hashedPassword })
}

exports.authenticateUser = async (username, password) => {
    
  if (!username?.trim() || !password?.trim()) {
    throwBadRequest("Username and password cannot be blank")
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

function throwBadRequest(message) {
  const err = new Error(message)
  err.status = 400
  throw err
}