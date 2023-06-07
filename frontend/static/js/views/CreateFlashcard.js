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
            <button id="create-flashcard">Create</button><br>
            <button id="redirect-to-deck" href="/decks/${this.params.deckId}" data-link>Cancel</button>
        `
        this.setHtml(html)

        document.querySelector("#generate-answer")?.addEventListener("click", this.generateAnswer)
        document.querySelector("#create-flashcard")?.addEventListener("click", this.createFlashcard)
    }

    createFlashcard() {
        const token = sessionStorage.getItem("token")
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

        const deckId = this.params.deckId
        const url = window.location.origin + "/api/decks/" + deckId + "/flashcards"
        const request = new XMLHttpRequest()
        request.open('POST', url, false)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send(JSON.stringify(newFlashcard))

        if (request.status == 200) {
            document.querySelector("#redirect-to-deck").click()
            alert("Flashcard created successfully")
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
        const token = sessionStorage.getItem("token")
        const url = window.location.origin + "/api/answers"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.send(JSON.stringify({ prompt: prompt }))
        if (request.status == 200) {
            const answerValue = JSON.parse(request.response)?.data
            const answer = document.querySelector("#prompt")
            if (answerValue && answer) {
                answer.value = answerValue
            }
            alert("Answer generated")
        } else {
            alert("An error occurred while retrieving the answer from ChatGPT")
        }
    }
   
}