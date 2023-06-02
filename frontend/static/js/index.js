import Homepage from "./views/Homepage.js";

const getPathRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

const getPathKeys = path => Array.from(path.matchAll(/:(\w+)/g)).map(result => result[1])

const routes = [
    { path: "/", view: Homepage },
].map(route => {
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
            params: getParams(matchingRoute.route.keys, matchingRoute.match)
        }
    }
    return null
}

const router = async () => {
    
    const matchingRoute = getRoute() ||  {
        route: routes[0],
        params: []
    }

    const view = new matchingRoute.route.view(matchingRoute.params)

    document.querySelector("#app").innerHTML = await view.getHtml()
}

const goToRoute = url => {
    history.pushState(null, null, url)
    router()
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            goToRoute(e.target.href);
        }
    })

    router()
})