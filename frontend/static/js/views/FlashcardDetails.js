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
            <button href="/decks/${this.params.deckId}" data-link>Close</button>
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
            const prompt = document.querySelector("#prompt")
            if (prompt) {
                prompt.value = this.flashcard?.prompt
            }
            const answer = document.querySelector("#answer")
            if (answer) {
                answer.value = this.flashcard?.answer
            }
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        }   

        if (this.flashcard) {
            document.querySelector("#regenerate-answer")?.addEventListener("click", this.regenerateAnswer)
            document.querySelector("#update-flashcard")?.addEventListener("click", this.updateFlashcard)
            document.querySelector("#delete-flashcard")?.addEventListener("click", this.deleteFlashcard)    
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
        request.send(JSON.stringify({prompt: prompt}))
        if (request.status == 200) { 
            const answerValue = JSON.parse(request.response)?.data
            const answer = document.querySelector("#prompt")
            if (answerValue && answer) {
                answer.value = answerValue
            }
            alert("Answer regenerated")
        } else {
            alert("An error occurred while retrieving the answer from ChatGPT")
        }
    }

    updateFlashcard() {
        const prompt = document.querySelector("#prompt")?.value?.trim()
        const answer = document.querySelector("#answer")?.value?.trim()
        if (!prompt || !answer || prompt == this.flashcard?.prompt || answer == this.flashcard?.answer) {
            return
        }        
        this.flashcard.prompt = prompt
        this.flashcard.answer = answer
        const token = sessionStorage.getItem("token")
        const deckId = this.params.deckId
        const flashcardId = this.params.id
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards/" + flashcardId
        const request = new XMLHttpRequest()
        request.open('PUT', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.status == 200) { 
                alert("Flashcard updated successfully")
            } else {
                alert("An error occurred while updating the flashcard")
            }
        }
        request.send(JSON.stringify(this.flashcard))
    }

    deleteFlashcard() {
        const token = sessionStorage.getItem("token")
        const deckId = this.params.id
        const flashcardId = this.params.id
        const url = window.location.origin + "/api/decks/" + deckId
        const request = new XMLHttpRequest()
        request.open('DELETE', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.status == 200) { 
                alert("Deck deleted successfully")
            } else {
                alert("An error occurred while deleting the flashcard")
            }
        }
        request.send()
    }
}