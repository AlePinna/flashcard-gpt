const express = require("express")
const flashcardController = require("../controllers/FlashcardController")
const deckController = require("../controllers/DeckController")
const userController = require("../controllers/UserController")
const chatGPTController = require("../controllers/ChatGPTController")
const authInterceptor = require("../interceptors/AuthInterceptor")
 
const router = express.Router()

router.route("/login").post(userController.authenticateUser)

router.route("/register").post(userController.createUser)

router.route("/answers").get(authInterceptor, chatGPTController.getAnswerForPrompt)

router.route("/decks")
  .get(authInterceptor, deckController.getAllDecks)
  .post(authInterceptor, deckController.createDeck)

router.route("/decks/:id")
  .get(deckController.getDeckById)
  .put(deckController.updateDeck)
  .delete(deckController.deleteDeck)

  router.route("/decks/:deckId/flashcards")
  .get(authInterceptor, flashcardController.getAllFlashcards)
  .post(authInterceptor, flashcardController.createFlashcard)

router.route("/decks/:deckId/flashcards/:id")
  .get(authInterceptor, flashcardController.getFlashcardById)
  .put(authInterceptor, flashcardController.updateFlashcard)
  .delete(authInterceptor, flashcardController.deleteFlashcard)
 
module.exports = router