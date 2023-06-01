const mongoose = require("mongoose")
const Schema = mongoose.Schema
 
const flashcardSchema = new Schema({
  prompt: String,
  answer: String
})

const deckSchema = new Schema({
  name: String,
  flashcards: [flashcardSchema],
  username: String
})
 
module.exports = mongoose.model("Deck", deckSchema)