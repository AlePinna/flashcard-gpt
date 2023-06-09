import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Decks Details")
    }

    async updateView() {
        const html = `
            <h2>Deck Details</h2><br>
            Name <input type="text" id="deck-name">

            <table id="flashcards-table" class="styled-table">
                <tr>
                    <th>Prompt</th>
                    <th>Details</th>
                </tr>
            </table>
            <button id="update-deck">Update</button>
            <button id="delete-deck">Delete</button>
            <button href="/decks/${this.params.id}/new_flashcard" data-link>New flashcard</button>
            <button href="/decks/${this.params.id}/review" data-link>Review cards</button>
            <button id="redirect-to-decks" href="/decks" data-link>Close</button>
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
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        }   

        if (this.deck) {
            document.querySelector("#deck-name").value = this.deck?.name
            document.querySelector("#update-deck")?.addEventListener("click", () => this.updateDeck(this))
            document.querySelector("#delete-deck")?.addEventListener("click", () => this.deleteDeck(this))    
        } else {
            alert("Deck not found")
            document.querySelector("#redirect-to-decks")?.click()
        }
    }

    getFlashcards() {
        const table = document.querySelector("#flashcards-table")
        if ((this.deck?.flashcards?.length || 0) == 0) {
            const row = table.insertRow(-1)
            const noDataCell = row.insertCell(0)
            noDataCell.setAttribute("colspan", 2)
            noDataCell.innerText = "No flashcards found"
        } else {
            this.deck.flashcards.forEach(flashcard => {
                const row = table.insertRow(-1)
                const promptCell = row.insertCell(0)
                promptCell.innerText = flashcard.prompt
                const viewCell = row.insertCell(1)
                viewCell.innerHTML =  `<button href="/decks/${this.deck._id}/flashcards/${flashcard._id}" data-link>View</button>`                
            })
        }   
    }

    updateDeck(view) {
        const deckName = document.querySelector("#deck-name")?.value?.trim()
        if (!deckName || deckName == view.deck?.name) {
            return
        }
        view.deck.name = deckName
        const token = sessionStorage.getItem("token")
        const deckId = view.params.id
        const url = window.location.origin + "/api/decks/" + deckId
        const request = new XMLHttpRequest()
        request.open('PUT', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.status == 200) { 
                alert("Deck updated successfully")
            } else {
                alert("An error occurred while updating the deck")
            }
        }
        request.send(JSON.stringify(view.deck))
    }

    deleteDeck(view) {
        const token = sessionStorage.getItem("token")
        const deckId = view.params.id
        const url = window.location.origin + "/api/decks/" + deckId
        const request = new XMLHttpRequest()
        request.open('DELETE', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.status == 200) { 
                alert("Deck deleted successfully")
                document.querySelector("#redirect-to-decks")?.click()
            } else {
                alert("An error occurred while deleting the deck")
            }
        }
        request.send()
    }
}