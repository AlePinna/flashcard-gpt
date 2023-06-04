export default class {
    constructor(params) {
        this.params = params
    }

    setTitle(title) {
        document.title = title
    }

    setHtml(html) {
        document.querySelector("#app").innerHTML = html
    }

    async updateView() {}
}