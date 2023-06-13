import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Review Deck")
        this.currentIndex = 0
    }

    async updateView() {
        const html = `
            <h2>Review Deck</h2>
            Deck <input disabled type="text" id="deck-name"/><br>
            Flashcard <input disabled size="7" type="text" id="flashcard-number"/><br>
            <br>
            Prompt<br>
            <textarea id="prompt" rows="2" cols="50"></textarea>
            <br><br>
            Answer<br>
            <textarea id="anti-spoiler" rows="8" cols="50">Click to reveal</textarea>       
            <textarea id="answer" rows="8" cols="50" style="display: none;"></textarea>
            <br>
            <button id="previous" style="display: none;">Previous</button>
            <button id="next">Next</button>
            <button href="/decks/${this.params.id}" data-link>Close</button>
        `
        this.setHtml(html)

        this.getDeck()
    }

    getDeck() {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const deckId = this.params.id
        const url = window.location.origin + "/api/decks/" + deckId
        const request = new XMLHttpRequest()
        request.open('GET', url, false)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send()
        
        if (request.status == 200) { 
            this.deck = JSON.parse(request.response)?.data
            document.querySelector("#deck-name").value = this.deck?.name
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        }   

        if (this.deck) {
            if ((this.deck.flashcards?.length || 0) == 0) {
                alert("No flashcards found")
                document.querySelector("#redirect-to-deck")?.click()
                return
            }
            else if (this.deck.flashcards.length <= 1) {
                document.querySelector("#next").style.display = "none" 
            } else {
                this.shuffleFlashcards()
            }
            this.loadFlashcard(this)

            document.querySelector("#previous")?.addEventListener("click", () => this.previous(this))
            document.querySelector("#next")?.addEventListener("click", () => this.next(this))
            document.querySelector("#anti-spoiler")?.addEventListener("click", this.revealAnswer)    
        } else {
            alert("Deck not found")
            document.querySelector("#redirect-to-deck")?.click()
        }
    }

    previous(view) {
        if (view.currentIndex <= 0) {
            document.querySelector("#previous").style.display = "none"
        }
        view.currentIndex--
        if (view.currentIndex == 0) {
            document.querySelector("#previous").style.display = "none"
        }
        document.querySelector("#next").style.display = ""
        this.loadFlashcard(view)
    }

    next(view) {
        if (view.currentIndex >= (view.deck.flashcards.length - 1)) {
            return
        }
        view.currentIndex++
        if (view.currentIndex == (view.deck.flashcards.length - 1)) {
            document.querySelector("#next").style.display = "none"
        }
        document.querySelector("#previous").style.display = ""
        this.loadFlashcard(view)
    }

    loadFlashcard(view) {
        document.querySelector("#answer").style.display = "none"
        document.querySelector("#anti-spoiler").style.display = ""
        document.querySelector("#flashcard-number").value = (view.currentIndex + 1) + "/" + view.deck.flashcards.length
        const currentFlashcard = view.deck.flashcards[view.currentIndex]
        document.querySelector("#prompt").value = currentFlashcard.prompt
        document.querySelector("#answer").value = currentFlashcard.answer
    }

    revealAnswer() {
        document.querySelector("#anti-spoiler").style.display = "none"
        document.querySelector("#answer").style.display = ""
    }

    shuffleFlashcards() {
        const shuffledFlashcards = this.deck.flashcards.sort((a, b) => 0.5 - Math.random())
        this.deck.flashcards = shuffledFlashcards
    }
}