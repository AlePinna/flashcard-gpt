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
            FlashcardGPT is a web application that simplifies flashcard creation and review.<br>
            With FlashcardGPT, you can easily create your flashcards and review them at your convenience.<br>
            What sets this webapp apart is the use of ChatGPT to complete the content on your flashcards.<br>
            ChatGPT uses advanced deep learning technologies to suggest the best content possible, making your flashcards more informative and engaging.<br>
            With FlashcardGPT, you'll be able to boost your learning experience and improve your retention of information.
            </p>
        `
        this.setHtml(html)
    }
}