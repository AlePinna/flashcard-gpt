import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Answers");
    }

    async updateView() {
        const html = `
        <h2>ChatGPT</h2><br>
        Prompt<br>
        <textarea id="prompt" rows="2" cols="50"></textarea>
        <br><br>
        <button id="submit-answer">OK</button>
        <br><br>
        Answer<br>       
        <textarea id="answer" rows="8" cols="50"></textarea>
    `
        this.setHtml(html)

        document.querySelector("#submit-answer").addEventListener("click", this.answer)
    }

    answer() {
        const token = sessionStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }

        const prompt = document.querySelector("#prompt")?.value

        if (!prompt) {
            alert("The prompt cannot be empty")
            return
        }
        
        const url = window.location.origin + "/api/answers"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.status == 200) {
                const answer = JSON.parse(request.response)?.data
                document.querySelector("#answer").innerHTML = answer
            } else {
                alert(request.response?.error)
            }
        }
        request.send(JSON.stringify({prompt: prompt}))
    }
}