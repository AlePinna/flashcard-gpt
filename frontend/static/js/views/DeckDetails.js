import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Decks Details")
    }

    async updateView() {
        const html = `
            <h2>Decks Details</h2><br>
            Name <input type="text" id="deck-name">

            <table id="flashcards-table" class="styled-table">
                <tr>
                    <th>Prompt</th>
                    <th>Details</th>
                </tr>
            </table>
            <button id="update-deck">Update</button>
            <button id="delete-deck">Delete</button>
            <button href="/decks" data-link>Close</button>
        `
        this.setHtml(html)

        this.getDeck()
        this.getFlashcards()
    }

    getDeck() {
        const token = sessionStorage.getItem("token")
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
            const deckName = document.querySelector("#deck-name")
            if (deckName) deckName.value = this.deck?.name            
        } else if (request.status == 401) {
            document.querySelector("#loggout").click()
            alert("Session expired, please log in again")
        }   
    }

    getFlashcards() {
        if (!this.deck?.flashcards) {
            return
        }
        
        const table = document.querySelector("#flashcards-table")
        this.deck.flashcards.forEach(flashcard => {
            const row = table.insertRow(-1)
            const promptCell = row.insertCell(0)
            promptCell.innerHTML = flashcard.prompt
            const viewCell = row.insertCell(1)
            viewCell.innerHTML =  `<button href="/decks/${this.deck.id}/flashcards/${flashcard._id}" data-link>View</button>`                
        })   
    }
}