const deckService = require("../services/DeckService")
 
exports.getAllDecks = async (req, res) => {
  try {
    const decks = await deckService.getAllDecks(req.username)
    res.json({ data: decks })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
 
exports.createDeck = async (req, res) => {
  try {
    const deck = await deckService.createDeck(req.body, req.username)
    res.json({ data: deck })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
 
exports.getDeckById = async (req, res) => {
  try {
    const deck = await deckService.getDeckById(req.params.id, req.username)
    if (deck) {
      res.json({ data: deck })
    } else {
      res.status(401).json({ error: "Deck not found" })
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.updateDeck = async (req, res) => {
  try {
    const deck = await deckService.updateDeck(req.params.id, req.username, req.body)
    if (deck) {
      res.json({ data: deck })
    } else {
      res.status(401).json({ error: "Deck not found" })
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.deleteDeck = async (req, res) => {
  try {
    const deck = await deckService.deleteDeck(req.params.id, req.username)
    if (deck) {
      res.json({ data: deck })
    } else {
      res.status(401).json({ error: "Deck not found" })
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

