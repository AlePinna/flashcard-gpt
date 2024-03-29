import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Login")
    }

    async updateView() {
        const html = `
            <h2>Log into your account</h2>
            <b>Username</b><br>
            <input id="username" type="text"/><br><br>
            <b>Password</b><br>
            <input id="password" type="password"/><br><br>
            <button id="submit-login">Login</button>
         `

        this.setHtml(html)

        document.querySelector("#submit-login").addEventListener("click", this.login)
        document.querySelector("#password").addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              this.login()
            }
        })
    }

    login() {
        const username = document.querySelector("#username")?.value?.trim()
        const password = document.querySelector("#password")?.value?.trim()
        if (!username || !password) {
            alert("Username and password cannot be blank")
            return
        }
        
        const url = window.location.origin + "/api/account/login"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) {
                const token = JSON.parse(request.response).token
                localStorage.setItem("token", token)
                document.querySelector("#home").click()
                alert("Login successful")
            } else if (request.status == 401) {
                alert("Incorrect username or password")
            } else {
                alert("An error occurred, please try again")
            }
        }
        request.send(JSON.stringify({ username: username, password: password }))
    }
}