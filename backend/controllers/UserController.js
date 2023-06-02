const userService = require("../services/UserService")
const jwtService = require("../services/JWTService")
 
exports.createUser = async (req, res) => {
  try {
    await userService.createUser(req.body.username, req.body.password)
    res.json({ result: `User ${req.body.username} created successfully` })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.authenticateUser = async (req, res) => {
  try {
    const isAuthenticated = await userService.authenticateUser(req.body.username, req.body.password)
    if (isAuthenticated) {
      res.json({ token: await jwtService.signJWT(req.body.username) })
    } else {
      res.status(401).json({ error: "Incorrect username or password" })
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}