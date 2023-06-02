const flashcardService = require("../services/FlashcardService")
 
exports.getAllFlashcards = async (req, res) => {
  try {
    const flashcards = await flashcardService.getAllFlashcards(req.params.deckId, req.username)
    res.json({ data: flashcards })
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.createFlashcard = async (req, res) => {
  try {
    const flashcard = await flashcardService.createFlashcard(req.params.deckId, req.username, req.body)
    if (flashcard) {
      res.json({ data: flashcard })
    } else {
      res.status(404).json("Deck not found")
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.getFlashcardById = async (req, res) => {
  try {
    const flashcard = await flashcardService.getFlashcardById(req.params.id, req.params.deckId, req.username)
    if (flashcard) {
      res.json({ data: flashcard })
    } else {
      res.status(404).json("Flashcard not found")
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.updateFlashcard = async (req, res) => {
  try {
    const flashcard = await flashcardService.updateFlashcard(req.params.id, req.params.deckId, req.username, req.body)
    if (flashcard) {
      res.json({ data: flashcard })
    } else {
      res.status(404).json("Flashcard not found")
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}
 
exports.deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await flashcardService.deleteFlashcard(req.params.id, req.params.deckId, req.username)
    if (flashcard) {
      res.json({ data: flashcard })
    } else {
      res.status(404).json("Flashcard not found")
    }
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message })
  }
}

