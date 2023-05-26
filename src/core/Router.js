import cors from 'cors'
import routes from "../routes.js"

const initialize = async (webServer, port) => {
    routes.forEach(route => {
        switch(route[0]) {
            case 'GET':
                webServer.get(route[1], async(request, response) => {
                    // return await route[2].bind(request, response)
                    return await route[2](request, response)
                })
                break;
            case 'POST':
                break;
        }
    })

    webServer.listen(port, () => {
        console.log(`API Listen on port ${port}`)
    })
}

const getRoutes = () => routes

export default {
    initialize,
    getRoutes
}