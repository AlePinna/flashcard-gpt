import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Register");
    }

    async updateView() {
        const html = `
        <h2>Create a new account</h2><br>
        Username <input id="username" type="text"/><br>
        Password <input id="password" type="password"/><br>
        Confirm password <input id="password-confirmation" type="password"/><br>
        <button id="submit-register">Login</button>
    `

        this.setHtml(html)

        document.querySelector("#submit-register").addEventListener("click", this.register)
    }

    register() {
        const username = document.querySelector("#username")?.value
        const password = document.querySelector("#password")?.value
        const confirmedPassword = document.querySelector("#password-confirmation")?.value
        if (!username || !password) {
            alert("Username and password cannot be empty")
            return
        }
        if (password !== confirmedPassword) {
            alert("Passwords don't match")
            return
        }
        
        const url = window.location.origin + "/api/register"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.onreadystatechange = (event) => {
            if (request.status == 200) { 
                document.querySelector("#home").click()
                alert("Account created successfully")
            } else {
                alert(request.response?.error)
            }
        }
        request.send(JSON.stringify({ username: username, password: password }))
    }
}