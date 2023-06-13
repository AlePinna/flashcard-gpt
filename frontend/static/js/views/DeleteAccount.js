import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Delete account")
    }

    async updateView() {
        const html = `
            <h2>Delete account</h2>
            Press <b>Delete</b> to delete your account permanently<br><br>
            This operation cannot be undone<br><br>
            <button id="submit-delete">Delete</button>
            <button href="/home" data-link>Cancel</button>
         `

        this.setHtml(html)

        document.querySelector("#submit-delete").addEventListener("click", this.deleteAccount)
    }

    deleteAccount() {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("Please login")
            return
        }
        
        if (!confirm("Do you want to proceed with the deletion of your account?")) {
            return
        }
        
        const url = window.location.origin + "/api/account/delete"
        const request = new XMLHttpRequest()
        request.open('DELETE', url)
        request.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        request.setRequestHeader("Authorization", "Bearer " + token)
        request.onreadystatechange = (event) => {
            if (request.readyState != 4) {
                return
            }
            if (request.status == 200) { 
                alert("Account deleted successfully")
                document.querySelector("#logout").click()
            } else {
                alert("An error occurred while deleting your account")
            }
        }
        request.send()
    }
}