import routes from "../routes.js"
import express from 'express'
const router = express.Router()

const initialize = async (webServer, port, prefix, middlewaresList) => {
    routes.forEach(route => {
        switch(route[0]) {
            case 'GET':
                router.get(`/${prefix}${route[1]}`, invokeMiddlewares(middlewaresList, route[2]), async(request, response) => await route[3](request, response))
                break;
            case 'POST':
                router.post(`/${prefix}${route[1]}`, invokeMiddlewares(middlewaresList, route[2]), async(request, response) => await route[3](request, response))
                break;
            case 'PATCH': 
                router.patch(`/${prefix}${route[1]}`, invokeMiddlewares(middlewaresList, route[2]), async(request, response) => await route[3](request, response))
                break;
            case 'PUT': 
                router.put(`/${prefix}${route[1]}`, invokeMiddlewares(middlewaresList, route[2]), async(request, response) => await route[3](request, response))
                break;
            case 'DELETE': 
                router.delete(`/${prefix}${route[1]}`, invokeMiddlewares(middlewaresList, route[2]), async(request, response) => await route[3](request, response))
                break;
        }
    })

    webServer.use('/', router)

    webServer.listen(port, () => {
        console.log(`${routes.length} routes loaded`)
        console.log(`API Listen on port ${port}`)
    })
}

const invokeMiddlewares = (middlewaresList, keysList) => {
    return middlewaresList.filter((middleware) => {
        return keysList.some((key) => {
            if (key === middleware.key) {
                return middleware
            }
        })
    }).map(activeMiddleware => activeMiddleware.on)
}

const getRoutes = () => routes

export default {
    initialize,
    getRoutes
}