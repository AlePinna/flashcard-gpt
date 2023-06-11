import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Flashcard Details")
    }

    async updateView() {
        const html = `
            <h2>Flashcard Details</h2><br>
            Prompt<br>
            <textarea id="prompt" rows="2" cols="50"></textarea>
            <br><br>
            Answer<br>       
            <textarea id="answer" rows="8" cols="50"></textarea>
            <br>
            <button id="regenerate-answer">Regenerate answer</button>
            <button id="update-flashcard">Update</button><br>
            <button id="delete-flashcard">Delete</button>
            <button id="redirect-to-deck" href="/decks/${this.params.deckId}" data-link>Close</button>
        `
        this.setHtml(html)

        this.getFlashcard()
    }

    getFlashcard() {
        const token = sessionStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const deckId = this.params.deckId
        const flashcardId = this.params.id
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards/" + flashcardId
        const request = new XMLHttpRequest()
        request.open('GET', url, false)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send()
        
        if (request.status == 200) { 
            this.flashcard = JSON.parse(request.response)?.data
            document.querySelector("#prompt").value = this.flashcard?.prompt
            document.querySelector("#answer").value = this.flashcard?.answer
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        }   

        if (this.flashcard) {
            document.querySelector("#regenerate-answer")?.addEventListener("click", this.regenerateAnswer)
            document.querySelector("#update-flashcard")?.addEventListener("click", () => this.updateFlashcard(this))
            document.querySelector("#delete-flashcard")?.addEventListener("click", () => this.deleteFlashcard(this))    
        } else {
            alert("Deck not found")
            document.querySelector("#redirect-to-deck")?.click()
        }
    }

    regenerateAnswer() {
        const prompt = document.querySelector("#prompt")?.value?.trim()
        if (!prompt) {
            return
        }
        const token = sessionStorage.getItem("token")
        const url = window.location.origin + "/api/answers"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) { 
                document.querySelector("#answer").value = JSON.parse(request.response)?.data
            } else {
                alert("An error occurred while retrieving the answer from ChatGPT")
            }
        }
        request.send(JSON.stringify({prompt: prompt}))
        alert("Please wait while the answer is being processed")
    }

    updateFlashcard(view) {
        const prompt = document.querySelector("#prompt")?.value?.trim()
        const answer = document.querySelector("#answer")?.value?.trim()
        if (!prompt || !answer || 
            (prompt == view.flashcard?.prompt && answer == view.flashcard?.answer)
        ) {
            return
        }        
        view.flashcard.prompt = prompt
        view.flashcard.answer = answer
        const token = sessionStorage.getItem("token")
        const deckId = view.params.deckId
        const flashcardId = view.params.id
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards/" + flashcardId
        const request = new XMLHttpRequest()
        request.open('PUT', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) { 
                alert("Flashcard updated successfully")
            } else {
                alert("An error occurred while updating the flashcard")
            }
        }
        request.send(JSON.stringify(view.flashcard))
    }

    deleteFlashcard(view) {
        const token = sessionStorage.getItem("token")
        const deckId = view.params.deckId
        const flashcardId = view.params.id
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards/" + flashcardId
        const request = new XMLHttpRequest()
        request.open('DELETE', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) { 
                alert("Flashcard deleted successfully")
                document.querySelector("#redirect-to-deck")?.click()
            } else {
                alert("An error occurred while deleting the flashcard")
            }
        }
        request.send()
    }
}