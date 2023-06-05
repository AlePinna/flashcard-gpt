import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Decks")
    }

    async updateView() {
        const html = `
            <h2>Decks</h2><br>
            <table id="decks-table" class="styled-table">
                <tr>
                    <th>Name</th>
                    <th>Cards</th>
                    <th>Details</th>
                </tr>
            </table>
        `
        this.setHtml(html)

        this.getDecks()
    }

    getDecks() {
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
            const decks = JSON.parse(request.response)?.data || []
            const table = document.querySelector("#decks-table")
            decks?.forEach(deck => {
                const row = table.insertRow(-1)
                const nameCell = row.insertCell(0)
                nameCell.innerHTML = deck.name
                const cardsCell = row.insertCell(1)
                cardsCell.innerHTML = deck.flashcards?.length || 0
                const viewCell = row.insertCell(2)
                viewCell.innerHTML =  `<button href="/decks/${deck._id}" data-link>View</button>`                
            })
        } else if (request.status == 401) {
            document.querySelector("#loggout").click()
            alert("Session expired, please log in again")
        }   
    }
}