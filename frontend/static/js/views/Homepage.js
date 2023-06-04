import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params)
        this.setTitle("Home")
    }

    async updateView() {
        const html = `
            <h1>Welcome to FlashcardGPT</h1>
            <p>
                This web app will help train your mnemonic skills with user-generated flashcard, with the help of ChatGPT.
            </p>
        `
        this.setHtml(html)
    }
}