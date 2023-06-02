const deckService = require("./DeckService")

exports.getAllFlashcards = async (deckId, username) => {
  return (await deckService.getDeckById(deckId, username)).flashcards
}

exports.createFlashcard = async (deckId, username, flashcard) => {
  let deck = await deckService.getDeckById(deckId, username)
  deck.flashcards.push(flashcard)
  await deckService.updateDeck(deckId, username, deck)
  deck = await deckService.getDeckById(deckId, username)
  return deck.flashcards.slice(-1)
}
    
exports.getFlashcardById = async (id, deckId, username) => {
  return (await deckService.getDeckById(deckId, username)).flashcards.find(flashcard => flashcard._id == id)
}

exports.updateFlashcard = async (id, deckId, username, updatedFlashcard) => {
  let deck = await deckService.getDeckById(deckId, username)
  if (!checkFlashcardExistsForDeck(id, deck)) {
    return null
  }
  updatedFlashcard._id = id
  deck.flashcards = deck.flashcards.map(flashcard => flashcard._id == id ? updatedFlashcard : flashcard)
  await deckService.updateDeck(deckId, username, deck)
  deck = await deckService.getDeckById(deckId, username)
  return deck.flashcards.find(flashcard => flashcard._id == id)
}

exports.deleteFlashcard = async (id, deckId, username) => {
  let deck = await deckService.getDeckById(deckId, username)
  if (!checkFlashcardExistsForDeck(id, deck)) {
    return null
  }
  let flashcard = deck.flashcards.find(flashcard => flashcard._id == id)
  deck.flashcards = deck.flashcards.filter(flashcard => flashcard._id != id)
  await deckService.updateDeck(deckId, username, deck)
  return flashcard
}

function checkFlashcardExistsForDeck(id, deck) {
  return deck.flashcards.some(flashcard => flashcard._id == id)
}