import Homepage from "./views/Homepage.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import Answers from "./views/Answers.js";
import Decks from "./views/Decks.js";
import DeckDetails from "./views/DeckDetails.js";

const routesToInitialize = [
    { path: "/", view: Homepage },
    { path: "/login", view: Login },
    { path: "/register", view: Register },
    { path: "/answers", view: Answers },
    { path: "/decks", view: Decks },
    { path: "/decks/:id", view: DeckDetails }
]

const getPathRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

const getPathKeys = path => Array.from(path.matchAll(/:(\w+)/g)).map(result => result[1])

const routes = routesToInitialize.map(route => {
    route.pathRegex = getPathRegex(route.path)
    route.pathKeys = getPathKeys(route.path)
    return route
})

const getParams = (keys, match) => {
    if (!keys) {
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
    }).find(wrappedRoute => wrappedRoute.match !== null)

    if (matchingRoute) {
        return {
            route: matchingRoute.route,
            params: getParams(matchingRoute.route.pathKeys, matchingRoute.match)
        }
    }
    return null
}

const checkSession = async () => {
    if ("token" in sessionStorage) {
        document.querySelector("#not-logged-in-links").style.display = "none"
        document.querySelector("#already-logged-in-links").style.display = "block"
    }
}

const router = async() => {
    checkSession()
    
    const matchingRoute = getRoute() ||  {
        route: routes[0],
        params: []
    }

    new matchingRoute.route.view(matchingRoute.params).updateView()
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

document.querySelector("#loggout").addEventListener("click", () => {
    sessionStorage.removeItem("token")
    document.querySelector("#not-logged-in-links").style.display = "block"
    document.querySelector("#already-logged-in-links").style.display = "none"
})