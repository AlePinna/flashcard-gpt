import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("New Flashcard")
    }

    async updateView() {
        const html = `
            <h2>New Flashcard</h2><br>
            Prompt<br>
            <textarea id="prompt" rows="2" cols="50"></textarea>
            <br><br>
            Answer<br>       
            <textarea id="answer" rows="8" cols="50"></textarea>
            <br>
            <button id="generate-answer">Generate answer</button>
            <button id="create-flashcard">Create flashcard</button><br>
            <button id="redirect-to-deck" href="/decks/${this.params.id}" data-link>Cancel</button>
        `
        this.setHtml(html)

        document.querySelector("#generate-answer")?.addEventListener("click", this.generateAnswer)
        document.querySelector("#create-flashcard")?.addEventListener("click", () => this.createFlashcard(this))
    }

    createFlashcard(view) {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const newFlashcard = {}
        const prompt = document.querySelector("#prompt")?.value?.trim()
        const answer = document.querySelector("#answer")?.value?.trim()
        if (prompt) {
            newFlashcard.prompt = prompt
        } else {
            alert("The prompt cannot be blank")
            return
        }
        if (answer) {
            newFlashcard.answer = answer
        } else {
            alert("The answer cannot be blank")
            return
        }

        const deckId = view.params.id
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards"
        const request = new XMLHttpRequest()
        request.open('POST', url, false)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send(JSON.stringify(newFlashcard))

        if (request.status == 200) {
            alert("Flashcard created successfully")
            document.querySelector("#redirect-to-deck").click()
        } else if (request.status == 401) {
            document.querySelector("#logout").click()
            alert("Session expired, please log in again")
        } else {
            alert("An error occurred while creating the flashcard")
        }

    }

    generateAnswer() {
        const prompt = document.querySelector("#prompt")?.value?.trim()
        if (!prompt) {
            return
        }
        const token = localStorage.getItem("token")
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
        request.send(JSON.stringify({ prompt: prompt }))
        alert("Please wait while the answer is being processed")
    }
   
}