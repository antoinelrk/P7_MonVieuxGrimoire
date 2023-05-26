import cors from 'cors'
import routes from "../routes.js"

const initialize = async (webServer, port) => {
    routes.forEach(route => {
        switch(route[0]) {
            case 'GET':
                webServer.get(route[1], async(request, response) => await route[2](request, response))
                break;
            case 'POST':
                webServer.post(route[1], async(request, response) => await route[2](request, response))
                break;
        }
    })

    webServer.listen(port, () => {
        console.log(`${routes.length} routes loaded`)
        console.log(`API Listen on port ${port}`)
    })
}

const getRoutes = () => routes

export default {
    initialize,
    getRoutes
}