import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Answers")
    }

    async updateView() {
        const html = `
        <h2>ChatGPT</h2><br>
        Prompt<br>
        <textarea id="prompt" rows="2" cols="50"></textarea>
        <br><br>
        <button id="submit-answer">Generate answer</button>
        <br><br>
        Answer<br>       
        <textarea id="answer" rows="8" cols="50"></textarea>
    `
        this.setHtml(html)

        document.querySelector("#submit-answer").addEventListener("click", this.answer)
    }

    answer() {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const prompt = document.querySelector("#prompt")?.value?.trim()

        if (!prompt) {
            alert("The prompt cannot be blank")
            return
        }
        
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
            } else if (request.status == 401) {
                document.querySelector("#logout").click()
                alert("Session expired, please log in again")
            } else {
                alert(request.response?.error)
            }
        }
        request.send(JSON.stringify({prompt: prompt}))
        alert("Please wait while the answer is being processed")
    }
}