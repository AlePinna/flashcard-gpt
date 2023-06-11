import Homepage from "./views/Homepage.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import Answers from "./views/Answers.js";
import Decks from "./views/Decks.js";
import CreateDeck from "./views/CreateDeck.js";
import DeckDetails from "./views/DeckDetails.js";
import CreateFlashcard from "./views/CreateFlashcard.js";
import FlashcardDetails from "./views/FlashcardDetails.js";
import Review from "./views/Review.js";
import DeleteAccount from "./views/DeleteAccount.js";

const routesToInitialize = [
    { path: "/", view: Homepage, requiresLogin: false },
    { path: "/login", view: Login, requiresLogin: false },
    { path: "/register", view: Register, requiresLogin: false },
    { path: "/delete_account", view: DeleteAccount, requiresLogin: true },
    { path: "/answers", view: Answers, requiresLogin: true },
    { path: "/decks", view: Decks, requiresLogin: true },
    { path: "/new_deck", view: CreateDeck, requiresLogin: true },
    { path: "/decks/:id", view: DeckDetails, requiresLogin: true },
    { path: "/decks/:id/new_flashcard", view: CreateFlashcard, requiresLogin: true },
    { path: "/decks/:id/review", view: Review, requiresLogin: true },
    { path: "/decks/:deckId/flashcards/:id", view: FlashcardDetails, requiresLogin: true }
]

const getPathRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([0-9a-zA-Z]+)") + "$")

const getPathKeys = path => Array.from(path.matchAll(/:(\w+)/g)).map(result => result[1])

const routes = routesToInitialize.map(route => {
    route.pathRegex = getPathRegex(route.path)
    route.pathKeys = getPathKeys(route.path)
    return route
})

const getParams = (keys, match) => {
    if (!keys || keys.length == 0 || !match || match.length == 0) {
        return {}
    }

    const values = match.slice(1);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]]
    }))
}

const getRoute = () => {

    const matchingRoute = routes.map(route => {
        return {
            route: route,
            match: location.pathname.match(route.pathRegex)
        }
    }).find(wrappedRoute => wrappedRoute.match)

    if (matchingRoute) {
        return {
            route: matchingRoute.route,
            params: getParams(matchingRoute.route.pathKeys, matchingRoute.match)
        }
    }
    return null
}

const checkSession = async (requiresLogin) => {
    if ("token" in localStorage) {
        document.querySelector("#not-logged-in-links").style.display = "none"
        document.querySelector("#already-logged-in-links").style.display = "block"
    } else if (requiresLogin) {
        return false
    }
    return true
}

const router = async() => {

    const fallbackRoute = {
        route: routes[0],
        params: []
    }
    
    let matchingRoute = getRoute() || fallbackRoute
    
    const finalRoute = await checkSession(matchingRoute.route.requiresLogin)
        ? matchingRoute
        : fallbackRoute

    new finalRoute.route.view(finalRoute.params).updateView()
}

const goToRoute = url => {
    history.pushState(null, null, url)
    router()
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            goToRoute(e.target.getAttribute("href"))
        }
    })

    router()
})

document.querySelector("#logout").addEventListener("click", () => {
    localStorage.removeItem("token")
    document.querySelector("#not-logged-in-links").style.display = "block"
    document.querySelector("#already-logged-in-links").style.display = "none"
})