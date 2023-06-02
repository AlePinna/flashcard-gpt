const jwtService = require("../services/JWTService")

module.exports = async (req, res, next) => {
    try {
      const authorization = req.headers.authorization
      if (!authorization?.startsWith("Bearer ")) {
          throw new Error("Missing bearer token")
      }
      const token = authorization.split(' ')[1]
      const { result, username } = await jwtService.verifyJWT(token)
      if (result) {
        req.username = username
        next()
      } else {
        throw new Error("Invalid token")
      }
    } catch (err) {
      res.status(401).json({
        error: err.message
      })
    }
}