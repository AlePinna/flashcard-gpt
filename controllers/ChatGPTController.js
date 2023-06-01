const chatGPTService = require("../services/ChatGPTService")
 
exports.getAnswerForPrompt = async (req, res) => {
  try {
    const answer = await chatGPTService.getAnswerForPrompt(req.body.prompt)
    res.json({ data: answer })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}