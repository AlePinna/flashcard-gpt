require('dotenv').config()
const jsonwebtoken = require("jsonwebtoken")
const secret = process.env.JWT_SECRET

exports.signJWT = async (username) => {
  return jsonwebtoken.sign({ username: username.trim() }, secret, { expiresIn: '24h' })
}

exports.verifyJWT = async (token) => {
    
  try {
    const decodedToken = jsonwebtoken.verify(token, secret)
    return { result: true, username: decodedToken.username }
  } catch (err) {
    return { result: false }
  }
}