import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Register")
    }

    async updateView() {
        const html = `
            <h2>Create a new account</h2>
            <b>Username</b>
            <br>
            <input id="username" type="text" placeholder="at least 4 characters" /><br><br>
            <b>Password</b>
            <br><input id="password" type="password" placeholder="at least 8 characters" /><br><br>
            <b>Confirm password</b>
            <br><input id="password-confirmation" type="password"/><br><br>
            <button id="submit-register">Register</button>
        `

        this.setHtml(html)

        document.querySelector("#submit-register").addEventListener("click", this.register)
    }

    register() {
        const username = document.querySelector("#username")?.value?.trim()
        const password = document.querySelector("#password")?.value?.trim()
        const confirmedPassword = document.querySelector("#password-confirmation")?.value?.trim()
        if (!username || !password) {
            alert("Username and password cannot be blank")
            return
        }
        if (password !== confirmedPassword) {
            alert("Passwords don't match")
            return
        }
        
        const url = window.location.origin + "/api/account/register"
        const request = new XMLHttpRequest()
        request.open('POST', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) { 
                document.querySelector("#login").click()
                alert("Account created successfully")
            } else {
                alert(JSON.parse(request.response)?.error)
            }
        }
        request.send(JSON.stringify({ username: username, password: password }))
    }
}