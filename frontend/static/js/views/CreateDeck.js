import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("New Deck")
    }

    async updateView() {
        const html = `
            <h2>New Deck</h2><br>
            Name <input type="text" id="deck-name">

            <button id="create-deck">Create</button>
            <button id="redirect-to-decks" href="/decks" data-link>Cancel</button>
        `
        this.setHtml(html)

        document.querySelector("#update-deck")?.addEventListener("click", this.createDeck)
    }

    getDeck() {
        const deckName = document.querySelector("#deck-name")?.value?.trim()
        if (!deckName) {
            alert("The deck name cannot be blank")
            return
        }
        const newDeck = { name: deckName }

        const token = sessionStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const url = window.location.origin + "/api/decks"
        const request = new XMLHttpRequest()
        request.open('GET', url, false)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send()
        
        if (request.status == 200) { 
            document.querySelector("#redirect-to-decks").click()
            alert("Deck created successfully")
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        } else {
            alert("An error occurred while creating the deck")
        }

    }

}