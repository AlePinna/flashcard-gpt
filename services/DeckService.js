const DeckModel = require("../models/Deck")

exports.getAllDecks = async (username) => {
  return await DeckModel.find({ username: username })
}

exports.createDeck = async (deck, username) => {
  deck.username = username
  return await DeckModel.create(deck)
}
    
exports.getDeckById = async (id, username) => {
  if (!checkDeckExistsForUser(id, username)) {
    return null
  }
  return await DeckModel.findById(id)
}

exports.updateDeck = async (id, username, deck) => {
  if (!checkDeckExistsForUser(id, username)) {
    return null
  }
  deck.username = username
  await DeckModel.findByIdAndUpdate(id, deck)
  return exports.getDeckById(id, username)
}

exports.deleteDeck = async (id, username) => {
  if (!checkDeckExistsForUser(id, username)) {
    return null
  }
  return await DeckModel.findByIdAndDelete(id)
}

checkDeckExistsForUser = async (id, username) => {
  return await DeckModel.exists({ _id: id, username: username })
} 