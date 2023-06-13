require('dotenv').config()
const openaiModule = require("openai")

const configuration = new openaiModule.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new openaiModule.OpenAIApi(configuration)

if (!configuration.apiKey) {
  throw new Error("OpenAI API key not configured, please follow instructions in README.md")
}

exports.getAnswerForPrompt = async (prompt) => {
    
  if (!prompt || prompt.trim().length === 0) {
    const err = new Error("Please enter a valid prompt")
    err.status = 400
    throw err
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [generatePrompt(prompt)],
      temperature: 1.0,
    })
    return completion.data.choices[0].message.content
  } catch(error) {
    console.log(error?.response?.data || error.message)
    throw error
  }
}

function generatePrompt(prompt) {
  const content = `Given the input '${prompt}' representing the prompt/question of a flashacard, provide a description/answer in the same language`
  return {role: "user", content: content}
}